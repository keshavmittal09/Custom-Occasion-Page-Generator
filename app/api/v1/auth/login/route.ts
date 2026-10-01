import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler, rateLimit, getClientIp } from "@/lib/api";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const ip = getClientIp(req);
  const { ok } = rateLimit(ip + ":login", 10, 60_000);
  if (!ok) return errorResponse("RATE_LIMITED", "Too many requests", 429);

  await connectDB();
  const body = LoginSchema.parse(await req.json());
  const user = await User.findOne({ email: body.email });
  if (!user || !user.isActive) return errorResponse("INVALID_CREDENTIALS", "Invalid email or password", 401);

  const valid = await bcrypt.compare(body.password, user.passwordHash);
  if (!valid) return errorResponse("INVALID_CREDENTIALS", "Invalid email or password", 401);

  const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });
  await setAuthCookie(token);

  return successResponse({ id: user._id, name: user.name, email: user.email, role: user.role }, "Login successful");
});
