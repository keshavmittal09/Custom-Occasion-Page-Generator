import { successResponse } from "@/lib/api";
import { CATALOG } from "@/templates/catalog";

// GET /api/v1/templates — public list of templates (id, name, preview, supported occasions)
export async function GET() {
  return successResponse(
    CATALOG.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.note,
      vibe: t.vibe,
      supportedOccasions: t.occasions,
      palette: t.palette,
      fonts: [t.font],
      preview: `/w/${t.demo}`,
    }))
  );
}
