import { protectedProcedure, adminProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';

export const settingRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.setting.findMany();
    // return as key => value
    return settings.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }),
});

// export type definition of API
export type SettingRouter = typeof settingRouter;
