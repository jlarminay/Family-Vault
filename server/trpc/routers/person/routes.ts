import { protectedProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';
import { createUserSchema, uploadImageSchema } from './schema';
import S3 from '@/server/utils/s3.js';

export const personRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.prisma.person.findMany({
      include: { image: true, videos: { include: { video: true, thumbnail: true } } },
    });
    return results.map((result) => ({
      ...result,
      videos: result.videos?.length || 0,
    }));
  }),

  getSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.person.findUniqueOrThrow({
        where: { id },
        include: {
          image: true,
          videos: {
            where: { published: true },
            include: { video: true, thumbnail: true },
          },
        },
      });
    }),

  create: protectedProcedure.input(createUserSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.person.create({ data: input });
  }),
  // uploadImage: protectedProcedure.input(uploadImageSchema).mutation(async ({ ctx, input }) => {
  //   const s3 = new S3();

  //   const randomString = Math.random().toString(16).slice(2);
  //   const imageName = `${randomString}_${input.name.split('/').pop()}`;
  //   console.log(await s3.upload({ key: `persons/${imageName}`, body: input.data }));

  //   const imageUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/persons/${imageName}`;
  //   console.log(imageUrl);
  //   return await ctx.prisma.person.update({
  //     where: { id: input.personId },
  //     data: { image: imageUrl },
  //   });
  // }),
});

// export type definition of API
export type PersonRouter = typeof personRouter;
