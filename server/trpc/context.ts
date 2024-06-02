import { type inferAsyncReturnType } from '@trpc/server';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export async function createContext(event: any) {
  return {
    prisma,
    event,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
