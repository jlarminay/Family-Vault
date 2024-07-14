import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';
import { searchSchema, editItemSchema } from './schema';

export const itemRouter = router({
  search: protectedProcedure.input(searchSchema).query(async ({ input, ctx }) => {
    const session = await getServerSession(ctx.event);
    const page = input.page || 1;
    const limit = 10;

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
        file: true,
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
        // search field
        if (input.search) {
          // check if search is for file name
          if (input.search.startsWith('file:')) {
            const search = input.search.split('file:')[1].trim();
            if (!item.file.some((file) => file.name.toLowerCase().includes(search.toLowerCase()))) {
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

        // filter by likes
        if (input.filterBy === 'liked' && !item.like.some((like) => like.userId === session?.id)) {
          return false;
        }
        // filter by private
        if (input.filterBy === 'private' && item.published === 'public') {
          return false;
        }

        return true;
      })
      .map((item) => {
        return {
          id: item.id,
          description: item.description,
          people: item.people,
          view: item.view,
          type: item.type,
          dateDisplay: item.dateDisplay,
          dateOrder: item.dateOrder.toISOString().split('T')[0] as any,
          createdAt: item.createdAt.toISOString().split('T')[0] as any,
          // owner
          ownerId: item.ownerId,
          owner: item.owner,
          like: item.like.length,
          // access
          published: item.published,
          allowList: item.allowList,
          blockList: item.blockList,
          // files
          image:
            item.file.length === 0
              ? null
              : item.file.find((file) => file.type === 'image' || file.type === 'thumbnail'),
          video: item.file.length === 0 ? null : item.file.find((file) => file.type === 'video'),
        };
      })
      .sort((a: any, b: any) => {
        if (input.sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (input.sortBy === 'title-desc') {
          return b.title.localeCompare(a.title);
        }
        if (input.sortBy === 'date-taken-desc') {
          return new Date(b.dateOrder).getTime() - new Date(a.dateOrder).getTime();
        }
        if (input.sortBy === 'date-taken-asc') {
          return new Date(a.dateOrder).getTime() - new Date(b.dateOrder).getTime();
        }
        if (input.sortBy === 'date-added-desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (input.sortBy === 'date-added-asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (input.sortBy === 'duration-desc') {
          return b.item?.metadata?.duration - a.item?.metadata?.duration;
        }
        if (input.sortBy === 'duration-asc') {
          return a.item?.metadata?.duration - b.item?.metadata?.duration;
        }
      });

    return {
      page: page,
      count: cleanedItems.length,
      items: cleanedItems.slice((page - 1) * limit, page * limit),
    };
  }),

  getRelated: protectedProcedure
    .input(z.object({ currentId: z.number(), limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { limit } = input;

      const currentItem = await ctx.prisma.item.findUniqueOrThrow({
        where: {
          id: input.currentId,
        },
      });
      const allItems = await ctx.prisma.item.findMany({
        where: {
          AND: [
            { id: { not: input.currentId } }, // exclude current item
            {
              OR: [
                { ownerId: session?.id },
                { published: 'public' },
                {
                  AND: [{ published: 'allow-few' }, { allowList: { some: { id: session?.id } } }],
                },
              ],
            },
          ],
        },
        include: {
          file: true,
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
            },
          },
        },
      });

      // somehow filter based on if the item is related to the current item

      return allItems.sort(() => Math.random() - Math.random()).slice(0, limit);
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
          file: true,
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
        },
      });

      // clean date before returning
      item.dateOrder = item.dateOrder.toISOString().split('T')[0] as any;

      if (!item.published && item.ownerId !== session?.id && session?.role !== 'admin') {
        throw new Error('Item not published');
      }

      return item;
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
        },
      });

      // add to history
      await ctx.prisma.history.create({
        data: {
          userId: session.id,
          itemId: input.id,
        },
      });
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

    return await ctx.prisma.item.update({
      where: { id: input.id },
      data: {
        description: input.description,
        people: input.people,
        dateDisplay: input.dateDisplay,
        dateOrder: input.dateOrder,
        published: input.published,
        allowList: {
          set: input.allowList?.map((user: any) => ({ id: user })) || [],
        },
      },
    });
  }),
});

// export type definition of API
export type ItemRouter = typeof itemRouter;
