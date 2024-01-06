import { z } from 'zod';

export const uploadVideoSchema = z.object({
  key: z.string().max(128),
  name: z.string().max(128),
  current: z.number(),
  total: z.number(),
  packet: z.string(),
});
