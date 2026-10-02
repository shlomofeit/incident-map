import bcrypt from "bcrypt";
import { z } from "zod";

const userSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .regex(/[A-Z]/, "Password must have at least one capital letter")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/[0-9]/, "Password must have at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must have at least one special character"),
});

export async function createUser(email, password) {
  const validation = userSchema.safeParse({ email, password });
  if (!validation.success)
    throw Object.assign(new Error(validation.error.issues[0].message), {
      status: 400,
    });
  const hashPassword = await bcrypt.hash(password, 12);
  return {
    email: validation.data.email,
    password: hashPassword,
    role: "user",
    createdAt: new Date(),
  };
}
