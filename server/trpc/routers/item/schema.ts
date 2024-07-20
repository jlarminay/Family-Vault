import { z } from 'zod';

export const searchSchema = z.object({
  search: z.string().max(128),
  filterBy: z.string(z.enum(['all', 'liked', 'mine'])),
  sortBy: z.string(
    z.enum([
      'title-asc',
      'title-desc',
      'date-taken-desc',
      'date-taken-asc',
      'date-added-desc',
      'date-added-asc',
      'duration-desc',
      'duration-asc',
    ]),
  ),
  page: z.number(),
});

export const editItemSchema = z.object({
  id: z.number(),
  description: z.string().max(1024).nullable().optional(),
  people: z.string().max(1024).nullable().optional(),
  dateEstimate: z.boolean().nullable().optional(),
  takenAt: z.string().max(16),
  published: z.string(z.enum(['public', 'private', 'allow-few', 'deny-few'])),
  allowList: z.array(z.number()).nullable().optional(),
  blockList: z.array(z.number()).nullable().optional(),
});
