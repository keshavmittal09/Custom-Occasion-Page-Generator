import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, successResponse, withErrorHandler } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };
const Body = z.object({ isActive: z.boolean() });

// PATCH /api/v1/admin/users/:id — { isActive }. Admins cannot deactivate themselves.
export const PATCH = withErrorHandler(async (req: NextRequest, ctx: Ctx) => {
  const admin = await requireAdmin(req);
  const { id } = await ctx.params;
  const { isActive } = Body.parse(await req.json());
  if (id === admin.userId) return errorResponse("FORBIDDEN", "You cannot deactivate your own account", 403);
  await connectDB();
  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true, projection: { passwordHash: 0 } });
  if (!user) return errorResponse("NOT_FOUND", "User not found", 404);
  return successResponse({ id, isActive: user.isActive }, isActive ? "User activated" : "User deactivated");
});
