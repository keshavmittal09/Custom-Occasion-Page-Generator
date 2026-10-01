import Wizard from "@/components/wizard/Wizard";
import { requirePageUser } from "@/lib/session";

export const metadata = { title: "Edit page · Wishly" };

// Same wizard, pre-filled. Publishing again keeps the same slug/link.
export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requirePageUser(`/pages/${id}/edit`);
  return <Wizard pageId={id} />;
}
