import z from 'zod';

export const signInSchema = z.object({
  body: z.object({
    username: z.string().nonempty('username is required').trim().toLowerCase(),
    password: z.string().nonempty('password is required').trim().toLowerCase(),
  }),
});
