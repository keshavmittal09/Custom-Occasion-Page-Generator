import { v2 as cloudinary } from "cloudinary";
import { Asset } from "@/models/Asset";
import { Page } from "@/models/Page";
import { assetIdFromUrl } from "@/lib/assets";

export const cloudinaryEnabled = () =>
  !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

export function cloudinaryClient() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

// Deletes a page's media (Cloudinary destroy + local assets), skipping anything a
// duplicated page still uses.
export async function destroyPageMedia(page: any) {
  const items: any[] = [...(page.media?.images ?? []), ...(page.media?.videos ?? [])];
  const music = page.theme?.music as string | undefined;

  const stillUsed = async (url: string) =>
    !!(await Page.exists({ _id: { $ne: page._id }, $or: [{ "media.images.url": url }, { "media.videos.url": url }, { "theme.music": url }] }));

  const cld = cloudinaryEnabled() ? cloudinaryClient() : null;
  const localIds: string[] = [];

  for (const item of items) {
    if (!item?.url || (await stillUsed(item.url))) continue;
    if (item.provider === "cloudinary" && item.publicId && cld) {
      await cld.uploader.destroy(item.publicId, { resource_type: item.type === "video" ? "video" : "image" }).catch(() => {});
    }
    const id = assetIdFromUrl(item.url);
    if (id) localIds.push(id);
  }
  const musicId = assetIdFromUrl(music);
  if (musicId && !(await stillUsed(music!))) localIds.push(musicId);
  if (localIds.length) await Asset.deleteMany({ _id: { $in: localIds } });
}
