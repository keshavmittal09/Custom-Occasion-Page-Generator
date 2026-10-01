import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { clearAuthCookie, getUser } from "@/lib/auth";
import { successResponse, errorResponse, withErrorHandler } from "@/lib/api";

// GET /api/v1/auth/me — current user (fresh from DB so deactivated users are signed out)
export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getUser(req);
  if (!session) return errorResponse("UNAUTHORIZED", "Not logged in", 401);
  await connectDB();
  const user = (await User.findById(session.userId).lean()) as any;
  if (!user || !user.isActive) {
    await clearAuthCookie();
    return errorResponse("UNAUTHORIZED", "Not logged in", 401);
  }
  return successResponse({ id: String(user._id), name: user.name, email: user.email, role: user.role });
});

// POST /api/v1/auth/me — kept for backwards compatibility: logs out
export async function POST() {
  await clearAuthCookie();
  return successResponse(null, "Logged out");
}
