import { protectedProcedure, adminProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { createUserSchema, editUserSchema } from './schema';
import { z } from 'zod';

export const userRouter = router({});

// export type definition of API
export type UserRouter = typeof userRouter;
