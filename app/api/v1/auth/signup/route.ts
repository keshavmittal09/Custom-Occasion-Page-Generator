import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler, rateLimit, getClientIp } from "@/lib/api";
import { sanitize } from "@/lib/sanitize";

const SignupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

// POST /api/v1/auth/signup (alias: /auth/register)
export const POST = withErrorHandler(async (req: NextRequest) => {
  const { ok } = rateLimit(getClientIp(req) + ":signup", 5, 60_000);
  if (!ok) return errorResponse("RATE_LIMITED", "Too many attempts. Try again in a minute.", 429);

  const body = SignupSchema.parse(await req.json());
  await connectDB();
  if (await User.exists({ email: body.email })) return errorResponse("EMAIL_TAKEN", "That email is already registered. Log in instead?", 409);

  const user = await User.create({ name: sanitize(body.name), email: body.email, passwordHash: await bcrypt.hash(body.password, 12) });
  await setAuthCookie(signToken({ userId: String(user._id), email: user.email, role: user.role, name: user.name }));
  return successResponse({ id: String(user._id), name: user.name, email: user.email, role: user.role }, "Account created", 201);
});
