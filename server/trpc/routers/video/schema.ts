import { z } from 'zod';

export const uploadVideoSchema = z.object({
  key: z.string().max(128),
  count: z.number(),
  packet: z.any(),
});

export const processVideoSchema = z.object({
  key: z.string().max(128),
  packets: z.number(),
  name: z.string().max(128),
});
