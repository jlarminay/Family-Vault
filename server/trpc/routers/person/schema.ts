import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().max(128),
  gender: z.string(z.enum(['Male', 'Female', 'Other'])),
  birthday: z.coerce.date().optional().nullable(),
});

export const uploadImageSchema = z.object({
  personId: z.number(),
  data: z.any(),
  name: z.string(),
});
