import Admin from "@/components/admin/Admin";
import { requirePageUser } from "@/lib/session";

export const metadata = { title: "Admin · Wishly" };

// Admins only — non-admins are redirected; every admin API also checks the role server-side
export default async function AdminPage() {
  await requirePageUser("/admin", "ADMIN");
  return <Admin />;
}
