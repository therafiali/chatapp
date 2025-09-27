import * as z from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8, "Password must be 6 digits"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
