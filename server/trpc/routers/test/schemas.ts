import { z } from 'zod';

export const testSchema = z.object({
  text: z.string().max(64).nullish().optional(),
});
