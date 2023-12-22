import { publicProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';
import { testSchema } from './schemas';

export const testRouter = router({
  hello: publicProcedure.input(testSchema).query(({ input }) => {
    return {
      greeting: `hello ${input?.text ?? 'world'}`,
    };
  }),
});

// export type definition of API
export type TestRouter = typeof testRouter;
