import { adminProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';
import { getServerSession } from '#auth';
import { checkFileChanges } from '@/server/utils/checkFileChanges';
import S3 from '@/server/utils/s3';

export const adminRouter = router({
  // item (R)
  ...{
    itemRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.item.findMany({
        include: { owner: true },
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
          provider: z.string(z.enum(['github', 'discord', 'google', 'spotify'])),
          role: z.string(z.enum(['admin', 'user'])),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const session = await getServerSession(ctx.event);
        const response = await ctx.prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            provider: input.provider,
            role: input.role,
          },
        });

        // write to logger
        const headers = Object.fromEntries(ctx.event.headers.entries());
        await logger.writeToLog({
          ip:
            headers['x-real-ip'] || headers['x-forwarded-for'] || headers['x-amzn-trace-id'] || '',
          route: ctx.event.context.params.trpc || '',
          method: ctx.event._method || '',
          responseSize: JSON.stringify(response).length || 0,
          requestBody: input,
          userId: session?.id || null,
          userAgent: headers['user-agent'] || '',
        });

        return response;
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
          provider: z.string(z.enum(['github', 'discord', 'google', 'spotify'])),
          role: z.string(z.enum(['admin', 'user'])),
          active: z.boolean(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const session = await getServerSession(ctx.event);
        const response = await ctx.prisma.user.update({
          where: { id: input.id },
          data: {
            name: input.name,
            email: input.email,
            provider: input.provider,
            role: input.role,
            active: input.active,
          },
        });

        // write to logger
        const headers = Object.fromEntries(ctx.event.headers.entries());
        await logger.writeToLog({
          ip:
            headers['x-real-ip'] || headers['x-forwarded-for'] || headers['x-amzn-trace-id'] || '',
          route: ctx.event.context.params.trpc || '',
          method: ctx.event._method || '',
          responseSize: JSON.stringify(response).length || 0,
          requestBody: input,
          userId: session?.id || null,
          userAgent: headers['user-agent'] || '',
        });

        return response;
      }),
  },

  // system logs (R)
  ...{
    systemLogRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.systemLog.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 200, // only return last 200 items
      });
    }),
  },

  // force recheck s3 bucket
  ...{
    getAllFiles: adminProcedure.query(async ({ ctx }) => {
      try {
        const s3Instance = S3.getInstance({
          region: useRuntimeConfig().s3.region || '',
          endpoint: useRuntimeConfig().s3.endpoint || '',
          accessKeyId: useRuntimeConfig().s3.accessKey || '',
          secretAccessKey: useRuntimeConfig().s3.secretKey || '',
        });
        return await s3Instance.getAllFiles();
      } catch (error) {
        return error;
      }
    }),
    forceRecheckS3Bucket: adminProcedure.query(async ({ ctx }) => {
      try {
        return await checkFileChanges();
      } catch (error) {
        return error;
      }
    }),
    refreshAllThumbnails: adminProcedure.query(async ({ ctx }) => {
      try {
        return await checkFileChanges({ updateThumbnailOnly: true });
      } catch (error) {
        return error;
      }
    }),
    updatePermissions: adminProcedure.query(async ({ ctx }) => {
      try {
        const s3Instance = S3.getInstance({
          region: useRuntimeConfig().s3.region || '',
          endpoint: useRuntimeConfig().s3.endpoint || '',
          accessKeyId: useRuntimeConfig().s3.accessKey || '',
          secretAccessKey: useRuntimeConfig().s3.secretKey || '',
        });
        const allFiles = await s3Instance.getAllFiles(true);

        // update permissions
        for (const file of allFiles) {
          const { key } = file;
          console.log('updating permissions for', key);
          await s3Instance.updateFilePermissions(key);
        }

        return allFiles.length;
      } catch (error) {
        return error;
      }
    }),
  },
});

// export type definition of API
export type AdminRouter = typeof adminRouter;
