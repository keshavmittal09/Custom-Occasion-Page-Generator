import { clearAuthCookie } from "@/lib/auth";
import { successResponse } from "@/lib/api";

// POST /api/v1/auth/logout
export async function POST() {
  await clearAuthCookie();
  return successResponse(null, "Logged out");
}
