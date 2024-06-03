import { type inferAsyncReturnType } from '@trpc/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createContext(event: any) {
  return {
    prisma,
    event,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
