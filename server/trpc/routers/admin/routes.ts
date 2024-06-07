import { adminProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';
import { editVideoSchema } from '../video/schema';
import { createCollectionSchema, editCollectionSchema } from '../collection/schema';
import { createUserSchema, editUserSchema } from '../user/schema';

export const adminRouter = router({
  // video (RU)
  ...{
    videoRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.video.findMany({
        include: { persons: true, owner: true },
      });
    }),
    videoUpdate: adminProcedure.input(editVideoSchema).mutation(async ({ ctx, input }) => {
      return await ctx.prisma.video.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          dateDisplay: input.dateDisplay,
          dateOrder: input.dateOrder,
          persons: {
            set: input.persons?.map((person) => ({ id: person })) || [],
          },
          collections: {
            set: input.collections?.map((collection) => ({ id: collection })) || [],
          },
          published: input.published,
        },
      });
    }),
  },

  // files (R)
  ...{
    filesRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.file.findMany({
        include: { video: true, thumbnail: true, person: true },
      });
    }),
  },

  // collection (CRUD)
  ...{
    collectionCreate: adminProcedure
      .input(createCollectionSchema)
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.collection.create({
          data: {
            name: input.name,
            description: input.description,
          },
        });
      }),
    collectionRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.collection.findMany();
    }),
    collectionUpdate: adminProcedure
      .input(editCollectionSchema)
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.collection.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
          },
        });
      }),
    collectionDelete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.collection.delete({
          where: { id: input.id },
        });
      }),
  },

  // user (CRU)
  ...{
    userCreate: adminProcedure.input(createUserSchema).mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          provider: input.provider,
          role: input.role,
        },
      });
    }),
    userRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.user.findMany();
    }),
    userUpdate: adminProcedure.input(editUserSchema).mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          provider: input.provider,
          role: input.role,
          active: input.active,
        },
      });
    }),
  },

  // report (RD)
  ...{
    reportRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.report.findMany({ include: { user: true, video: true } });
    }),
    reportDelete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.report.delete({
          where: { id: input.id },
        });
      }),
  },
});

// export type definition of API
export type AdminRouter = typeof adminRouter;
