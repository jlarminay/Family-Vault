import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { createUserSchema, editUserSchema } from './schema';
import { z } from 'zod';

export const userRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const session = await getServerSession(ctx.event);
    return await ctx.prisma.user.findMany();
  }),
  getSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.user.findUniqueOrThrow({
        where: { id },
      });
    }),

  create: protectedProcedure.input(createUserSchema).mutation(async ({ ctx, input }) => {
    const { name, email, provider } = input;
    return await ctx.prisma.user.create({
      data: { name, email, provider },
    });
  }),
  update: protectedProcedure.input(editUserSchema).mutation(async ({ ctx, input }) => {
    const { id, name, email, provider, active } = input;
    return await ctx.prisma.user.update({
      where: { id },
      data: { name, email, provider, active },
    });
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.user.update({
        where: { id },
        data: { active: false },
      });
    }),
});

// export type definition of API
export type UserRouter = typeof userRouter;
