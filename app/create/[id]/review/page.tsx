import Wizard from "@/components/wizard/Wizard";
import { requirePageUser } from "@/lib/session";

export const metadata = { title: "Review & generate · Wishly" };

// Opens a saved draft straight on the Review & generate step
export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePageUser(`/create/${id}/review`);
  return <Wizard pageId={id} initialStep={5} />;
}
