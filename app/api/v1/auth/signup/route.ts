import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler, rateLimit, getClientIp } from "@/lib/api";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const ip = getClientIp(req);
  const { ok } = rateLimit(ip + ":signup", 5, 60_000);
  if (!ok) return errorResponse("RATE_LIMITED", "Too many requests", 429);

  await connectDB();
  const body = SignupSchema.parse(await req.json());
  const exists = await User.findOne({ email: body.email });
  if (exists) return errorResponse("EMAIL_TAKEN", "Email already registered", 409);

  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await User.create({ name: body.name, email: body.email, passwordHash });
  const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });
  await setAuthCookie(token);

  return successResponse(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    "Account created",
    201
  );
});
