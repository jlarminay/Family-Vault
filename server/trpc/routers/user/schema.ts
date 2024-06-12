import { z } from 'zod';

export const editOwnUserSchema = z.object({
  id: z.number(),
  name: z.string().max(64),
});
