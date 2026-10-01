import Wizard from "@/components/wizard/Wizard";
import { requirePageUser } from "@/lib/session";

export const metadata = { title: "Create a surprise · Wishly" };

// Protected: creators must be logged in (drafts are saved to their account)
export default async function CreatePage() {
  await requirePageUser("/create");
  return <Wizard />;
}
