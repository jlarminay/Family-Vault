import { z } from 'zod';

export const uploadVideoSchema = z.object({
  key: z.string().max(128),
  name: z.string().max(128),
  count: z.number(),
  final: z.boolean().optional().default(false),
  packet: z.any(),
});
