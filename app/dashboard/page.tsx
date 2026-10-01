import Dashboard from "@/components/dashboard/Dashboard";
import { requirePageUser } from "@/lib/session";

export const metadata = { title: "My pages · Wishly" };

export default async function DashboardPage() {
  const user = await requirePageUser("/dashboard");
  return <Dashboard name={user.name || user.email} />;
}
