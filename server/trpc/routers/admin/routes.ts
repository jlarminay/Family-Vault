import { adminProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';
import S3 from '~/server/utils/s3';

export const adminRouter = router({
  // item (R)
  ...{
    itemRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.item.findMany({
        include: { owner: true },
      });
    }),
  },

  // files (R)
  ...{
    filesRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.file.findMany({
        include: { item: true },
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
      return await ctx.prisma.report.findMany({ include: { user: true, item: true } });
    }),
    reportDelete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.report.delete({
          where: { id: input.id },
        });
      }),
  },

  // s3 commands
  ...{
    getAllFiles: adminProcedure.query(async () => {
      const s3 = new S3();
      console.log('running s3');
      return await s3.getAllFiles();
    }),
    getMetadata: adminProcedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
      const s3 = new S3();
      return await s3.getFileMetadata(input.key);
    }),
  },
});

// export type definition of API
export type AdminRouter = typeof adminRouter;
