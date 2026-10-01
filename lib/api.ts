import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ success: true, data, ...(message && { message }) }, { status });
}

export function errorResponse(code: string, message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: { code, message, ...(details !== undefined && { details }) } }, { status });
}

type RouteHandler = (req: NextRequest, ctx?: any) => Promise<Response>;

// Central error handler: consistent JSON error shape, never leaks stack traces
export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err: any) {
      if (err instanceof ZodError) {
        const details = err.issues.map((i) => ({ path: i.path.join("."), issue: i.message }));
        return errorResponse("VALIDATION_ERROR", details[0]?.issue || "Invalid request data", 400, details);
      }
      if (err?.code && err?.status) return errorResponse(err.code, err.message, err.status);
      if (err?.name === "CastError") return errorResponse("NOT_FOUND", "Not found", 404);
      if (err?.code === 11000) return errorResponse("CONFLICT", "That already exists", 409);
      console.error("[API Error]", err);
      return errorResponse("INTERNAL_ERROR", "Something went wrong", 500);
    }
  };
}

export function httpError(code: string, message: string, status: number) {
  return Object.assign(new Error(message), { code, status });
}

// Simple in-memory fixed-window limiter (per server instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) return { ok: false, remaining: 0 };
  entry.count++;
  return { ok: true, remaining: limit - entry.count };
}

export function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

// ?page=1&limit=20&sort=-createdAt&search=...
export function listParams(req: NextRequest, allowedSort: string[] = ["createdAt", "updatedAt"]) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "20", 10) || 20));
  const rawSort = sp.get("sort") || "-createdAt";
  const field = rawSort.replace(/^-/, "");
  const sort: Record<string, 1 | -1> = { [allowedSort.includes(field) ? field : "createdAt"]: rawSort.startsWith("-") ? -1 : 1 };
  const search = (sp.get("search") || "").trim().slice(0, 80);
  return { page, limit, sort, search, skip: (page - 1) * limit };
}

export function paginated<T>(items: T[], total: number, page: number, limit: number) {
  return { items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
