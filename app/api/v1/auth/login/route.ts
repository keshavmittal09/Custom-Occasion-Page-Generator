import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler, rateLimit, getClientIp } from "@/lib/api";

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

// POST /api/v1/auth/login
export const POST = withErrorHandler(async (req: NextRequest) => {
  const { ok } = rateLimit(getClientIp(req) + ":login", 10, 60_000);
  if (!ok) return errorResponse("RATE_LIMITED", "Too many attempts. Try again in a minute.", 429);

  const body = LoginSchema.parse(await req.json());
  await connectDB();
  const user = (await User.findOne({ email: body.email })) as any;
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) return errorResponse("INVALID_CREDENTIALS", "Wrong email or password", 401);
  if (!user.isActive) return errorResponse("ACCOUNT_DISABLED", "This account has been disabled", 403);

  await setAuthCookie(signToken({ userId: String(user._id), email: user.email, role: user.role, name: user.name }));
  return successResponse({ id: String(user._id), name: user.name, email: user.email, role: user.role }, "Welcome back!");
});
