import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "occasion_token";

export type JWTPayload = { userId: string; email: string; role: "USER" | "ADMIN"; name?: string };

// JWT_SECRET is required in production. Locally we fall back to a random per-process secret
// (sessions reset on restart) so nobody has to commit or share a secret to try the app.
function secret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.VERCEL) {
    throw Object.assign(new Error("JWT_SECRET is not set. Add it in your Vercel environment variables."), { code: "CONFIG_ERROR", status: 500 });
  }
  const g = globalThis as any;
  if (!g.__devJwtSecret) {
    g.__devJwtSecret = crypto.randomBytes(32).toString("hex");
    console.warn("[auth] JWT_SECRET not set — using a random development secret");
  }
  return g.__devJwtSecret;
}

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, secret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, secret()) as JWTPayload;
}

// Short-lived token issued after a correct page password (POST /public/pages/:slug/unlock)
export function signViewToken(slug: string) {
  return jwt.sign({ slug }, secret(), { expiresIn: "2h", audience: "page-view" });
}

export function verifyViewToken(token: string | null, slug: string) {
  if (!token) return false;
  try {
    const p = jwt.verify(token, secret(), { audience: "page-view" }) as { slug: string };
    return p.slug === slug;
  } catch {
    return false;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getUser(req?: NextRequest): Promise<JWTPayload | null> {
  try {
    let token: string | undefined;
    if (req) {
      token = req.cookies.get(COOKIE_NAME)?.value ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    }
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth(req: NextRequest): Promise<JWTPayload> {
  const user = await getUser(req);
  if (!user) throw Object.assign(new Error("Please log in to continue"), { code: "UNAUTHORIZED", status: 401 });
  return user;
}

export async function requireAdmin(req: NextRequest): Promise<JWTPayload> {
  const user = await requireAuth(req);
  if (user.role !== "ADMIN") throw Object.assign(new Error("Admins only"), { code: "FORBIDDEN", status: 403 });
  return user;
}
