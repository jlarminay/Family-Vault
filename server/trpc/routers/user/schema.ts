import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().max(64),
  email: z.string().max(128),
  provider: z.string().max(32),
});

export const editUserSchema = z.object({
  id: z.number(),
  name: z.string().max(64),
  email: z.string().max(128),
  provider: z.string().max(32),
  active: z.boolean(),
});
