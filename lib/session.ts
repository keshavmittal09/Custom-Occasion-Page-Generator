import { redirect } from "next/navigation";
import { getUser, type JWTPayload } from "@/lib/auth";

// Server-side route protection for pages (APIs check auth themselves on every request)
export async function requirePageUser(next: string, role?: "ADMIN"): Promise<JWTPayload> {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (role && user.role !== role) redirect("/dashboard");
  return user;
}
