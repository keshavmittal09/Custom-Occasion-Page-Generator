import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ success: true, data, ...(message && { message }) }, { status });
}

export function errorResponse(code: string, message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: { code, message, ...(details !== undefined && { details }) } },
    { status }
  );
}

type RouteHandler = (req: NextRequest, ctx?: any) => Promise<NextResponse>;
import { NextRequest } from "next/server";

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return errorResponse("VALIDATION_ERROR", "Invalid request data", 400, err.flatten().fieldErrors);
      }
      if (err.code && err.status) return errorResponse(err.code, err.message, err.status);
      console.error("[API Error]", err);
      return errorResponse("INTERNAL_ERROR", "Something went wrong", 500);
    }
  };
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) return { ok: false, remaining: 0 };
  entry.count++;
  return { ok: true, remaining: limit - entry.count };
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
