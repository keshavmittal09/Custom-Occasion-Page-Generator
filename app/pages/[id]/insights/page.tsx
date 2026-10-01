import Insights from "@/components/dashboard/Insights";
import { requirePageUser } from "@/lib/session";

export const metadata = { title: "Insights · Wishly" };

export default async function InsightsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePageUser(`/pages/${id}/insights`);
  return <Insights id={id} />;
}
