import { adminProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';
import dayjs from 'dayjs';

export const adminRouter = router({
  // video (R)
  ...{
    videoRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.video.findMany({
        include: { persons: true, owner: true },
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
      .input(
        z.object({
          name: z.string().max(64),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.collection.create({
          data: {
            name: input.name,
          },
        });
      }),
    collectionRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.collection.findMany({ include: { videos: true } });
    }),
    collectionUpdate: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().max(64),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.collection.update({
          where: { id: input.id },
          data: {
            name: input.name,
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
    userCreate: adminProcedure
      .input(
        z.object({
          name: z.string().max(64),
          email: z.string().max(128),
          provider: z.string(z.enum(['github', 'discord', 'google'])),
          role: z.string(z.enum(['admin', 'user'])),
        }),
      )
      .mutation(async ({ ctx, input }) => {
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
    userUpdate: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().max(64),
          email: z.string().max(128),
          provider: z.string(z.enum(['github', 'discord', 'google'])),
          role: z.string(z.enum(['admin', 'user'])),
          active: z.boolean(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
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

  // person (CRUD)
  ...{
    personCreate: adminProcedure
      .input(
        z.object({
          name: z.string(),
          birthday: z.string().optional().nullable(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.person.create({
          data: {
            name: input.name,
            birthday: input.birthday ? dayjs(input.birthday).toISOString() : null,
          },
        });
      }),
    personRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.person.findMany({ include: { videos: true } });
    }),
    personUpdate: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string(),
          birthday: z.string().optional().nullable(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.person.update({
          where: { id: input.id },
          data: {
            name: input.name,
            birthday: input.birthday ? dayjs(input.birthday).toISOString() : null,
          },
        });
      }),
    personDelete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.person.delete({
          where: { id: input.id },
        });
      }),
  },
});

// export type definition of API
export type AdminRouter = typeof adminRouter;
