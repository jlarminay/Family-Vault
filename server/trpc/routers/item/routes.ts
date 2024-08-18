import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';
import { searchSchema, editItemSchema } from './schema';
import dayjs from 'dayjs';

export const itemRouter = router({
  search: protectedProcedure.input(searchSchema).query(async ({ input, ctx }) => {
    const session = await getServerSession(ctx.event);
    const page = input.page || 1;
    const limit = 100;

    const items = await ctx.prisma.item.findMany({
      where: {
        OR: [
          { ownerId: session?.id },
          { published: 'public' },
          {
            AND: [{ published: 'allow-few' }, { allowList: { some: { id: session?.id } } }],
          },
        ],
      },
      include: {
        like: {
          select: {
            userId: true,
          },
        },
        allowList: {
          select: {
            id: true,
            name: true,
          },
        },
        blockList: {
          select: {
            id: true,
            name: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // filter and sort items
    const cleanedItems = items
      .filter((item) => {
        // filter by likes
        if (input.filterBy === 'liked' && !item.like.some((like) => like.userId === session?.id)) {
          return false;
        }
        // filter by private
        if (input.filterBy === 'private' && item.published === 'public') {
          return false;
        }
        // filter by unknown
        if (input.filterBy === 'unknown' && item.takenAt !== '1900-01-01') {
          return false;
        }

        // filter by type
        if (input.type.length > 0 && !input.type.includes(item.type)) {
          return false;
        }

        // search field
        if (input.search) {
          // check if search is for file name
          if (input.search.startsWith('file:')) {
            const search = input.search.split('file:')[1].trim();
            if (
              !item.name.toLowerCase().includes(search.toLowerCase()) &&
              !item.path.toLowerCase().includes(search.toLowerCase())
            ) {
              return false;
            }
          }
          // check for people
          else if (input.search.startsWith('person:')) {
            const search = input.search.split('person:')[1].trim();
            if (!item.people?.toLowerCase().includes(search.toLowerCase())) {
              return false;
            }
          }
          // check if search is for anything else
          else if (
            !(
              item.description?.toLowerCase().includes(input.search.toLowerCase()) ||
              item.people?.toLowerCase().includes(input.search.toLowerCase())
            )
          ) {
            return false;
          }
        }

        return true;
      })
      .map((item) => {
        return {
          ...item,
          // takenAt: item.takenAt.toISOString().split('T')[0],
          // createdAt: dayjs(item.createdAt).format('YYYY-MM-DD') as string,
          like: item.like.length,
        };
      })
      .sort((a: any, b: any) => {
        if (input.sortBy === 'date-taken-desc') {
          const dateDiff = dayjs(b.takenAt).diff(dayjs(a.takenAt));
          if (dateDiff !== 0) return dateDiff;
          return b.name.localeCompare(a.name);
        }
        if (input.sortBy === 'date-added-desc') {
          const dateDiff = dayjs(b.createdAt).diff(dayjs(a.createdAt));
          if (dateDiff !== 0) return dateDiff;
          return b.name.localeCompare(a.name);
        }
      });

    return {
      page: page,
      count: cleanedItems.length,
      items: cleanedItems.slice((page - 1) * limit, page * limit),
    };
  }),

  getSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);

      const item = await ctx.prisma.item.findUniqueOrThrow({
        where: {
          id: input.id,
          AND: [
            // allow admin to see any item, but they must have the url
            // the items won't show in search results
            session?.role !== 'admin'
              ? {
                  OR: [
                    { ownerId: session?.id },
                    { published: 'public' },
                    {
                      AND: [
                        { published: 'allow-few' },
                        { allowList: { some: { id: session?.id } } },
                      ],
                    },
                  ],
                }
              : {},
          ],
        },
        include: {
          like: {
            select: {
              userId: true,
            },
          },
          owner: {
            select: {
              name: true,
              avatar: true,
            },
          },
          allowList: {
            select: {
              id: true,
              name: true,
            },
          },
          blockList: {
            select: {
              id: true,
              name: true,
            },
          },
          location: true,
        },
      });

      if (!item.published && item.ownerId !== session?.id && session?.role !== 'admin') {
        throw new Error('Item not published');
      }

      return {
        ...item,
        // takenAt: item.takenAt.toISOString().split('T')[0],
        // createdAt: dayjs(item.createdAt).format('YYYY-MM-DD') as string,
        like: item.like.length,
      };
    }),

  incrementViewCount: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      if (!session) throw new Error('Unauthorized');

      // add view to item
      await ctx.prisma.item.update({
        where: { id: input.id },
        data: {
          view: {
            increment: 1,
          },
        },
      });

      // add view to user
      await ctx.prisma.user.update({
        where: { id: session.id },
        data: {
          views: {
            increment: 1,
          },
          lastActive: new Date(),
        },
      });

      // add to history
      // await ctx.prisma.history.create({
      //   data: {
      //     userId: session.id,
      //     itemId: input.id,
      //   },
      // });
    }),

  update: protectedProcedure.input(editItemSchema).mutation(async ({ ctx, input }) => {
    const session = await getServerSession(ctx.event);

    // is user the owner
    const item = await ctx.prisma.item.findUnique({ where: { id: input.id } });
    if (item && item.ownerId !== session?.id) {
      throw new Error('Forbidden');
    }

    // clear list if public or private
    if (input.published === 'public' || input.published === 'private') {
      input.allowList = [];
    }

    // create new location
    if (input.newLocation) {
      // get location data
      const cleanedData = input.newLocation.latLong.split(',').map((item) => item.trim());
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${cleanedData[0]}&lon=${cleanedData[1]}`;
      const locationResponse = await fetch(url).then((res) => res.json());

      // insert into db
      const location = await ctx.prisma.location.create({
        data: {
          name: input.newLocation.name,
          latLong: input.newLocation.latLong,
          city:
            locationResponse?.address?.city ||
            locationResponse?.address?.town ||
            locationResponse?.address?.village ||
            locationResponse?.address?.municipality ||
            null,
          country: locationResponse?.address?.country || null,
        },
      });
      input.locationId = location.id;
    }

    const response = await ctx.prisma.item.update({
      where: { id: input.id },
      data: {
        description: input.description,
        people: input.people,
        takenAt: input.takenAt,
        dateEstimate: input.dateEstimate || false,
        locationId: input.locationId,
        published: input.published,
        allowList: {
          set: input.allowList?.map((user: any) => ({ id: user })) || [],
        },
      },
    });

    // write to logger
    const headers = Object.fromEntries(ctx.event.headers.entries());
    await logger.writeToLog({
      ip: headers['x-real-ip'] || headers['x-forwarded-for'] || headers['x-amzn-trace-id'] || '',
      route: ctx.event.context.params.trpc || '',
      method: ctx.event._method || '',
      responseSize: JSON.stringify(response).length || 0,
      requestBody: input,
      userId: session?.id || null,
      userAgent: headers['user-agent'] || '',
    });

    return response;
  }),
});

// export type definition of API
export type ItemRouter = typeof itemRouter;
