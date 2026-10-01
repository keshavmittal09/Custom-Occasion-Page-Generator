import { NextRequest } from "next/server";
import { clearAuthCookie, getUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api";

export async function POST(req: NextRequest) {
  await clearAuthCookie();
  return successResponse(null, "Logged out");
}

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return errorResponse("UNAUTHORIZED", "Not authenticated", 401);
  return successResponse(user);
}
