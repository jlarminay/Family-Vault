import { z } from 'zod';

export const createCollectionSchema = z.object({
  name: z.string().max(64),
  description: z.string().max(1024),
});

export const editCollectionSchema = z.object({
  id: z.number(),
  name: z.string().max(64),
  description: z.string().max(1024),
});
