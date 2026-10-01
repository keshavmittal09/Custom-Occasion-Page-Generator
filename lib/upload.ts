"use client";
import imageCompression from "browser-image-compression";

export type Uploaded = { url: string; publicId: string; provider: "cloudinary" | "local"; w?: number; h?: number; duration?: number };
type Kind = "image" | "video" | "audio";

export const LIMITS = {
  imageBytes: 8 * 1024 * 1024, // before compression
  videoBytes: 50 * 1024 * 1024,
  videoSeconds: 60,
  localBytes: 4 * 1024 * 1024, // built-in store (no Cloudinary)
};

function post(url: string, body: FormData | Blob, headers: Record<string, string>, onProgress?: (p: number) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open("POST", url);
    Object.entries(headers).forEach(([k, v]) => x.setRequestHeader(k, v));
    x.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    x.onload = () => {
      let json: any = null;
      try {
        json = JSON.parse(x.responseText);
      } catch {}
      if (x.status >= 200 && x.status < 300) resolve(json);
      else reject(new Error(json?.error?.message || `Upload failed (${x.status})`));
    };
    x.onerror = () => reject(new Error("Network error while uploading"));
    x.send(body);
  });
}

let cloudinary: boolean | undefined;
export const usesCloudinary = () => cloudinary === true;

// Direct browser → Cloudinary upload with server-signed params; falls back to /api/v1/assets
export async function uploadFile(file: Blob, kind: Kind, onProgress?: (p: number) => void): Promise<Uploaded> {
  if (cloudinary !== false) {
    const res = await fetch("/api/v1/uploads/sign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resource_type: kind === "image" ? "image" : "video" }) });
    if (res.status === 501) cloudinary = false;
    else {
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || "Upload not allowed");
      cloudinary = true;
      const s = json.data;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", s.apiKey);
      fd.append("timestamp", String(s.timestamp));
      fd.append("signature", s.signature);
      fd.append("folder", s.folder);
      const r = await post(s.uploadUrl, fd, {}, onProgress);
      return { url: r.secure_url, publicId: r.public_id, provider: "cloudinary", w: r.width, h: r.height, duration: r.duration };
    }
  }
  if (file.size > LIMITS.localBytes) throw new Error("Files over 4 MB need Cloudinary — add your Cloudinary keys to upload bigger files");
  const r = await post("/api/v1/assets", file, { "Content-Type": file.type || "application/octet-stream" }, onProgress);
  return { url: r.data.url, publicId: r.data.publicId, provider: "local" };
}

export function imageSize(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth || 1080, h: img.naturalHeight || 1350 });
    img.onerror = () => resolve({ w: 1080, h: 1350 });
    img.src = src;
  });
}

export function videoMeta(file: File): Promise<{ w: number; h: number; duration: number }> {
  return new Promise((resolve) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      resolve({ w: v.videoWidth || 1280, h: v.videoHeight || 720, duration: v.duration || 0 });
      URL.revokeObjectURL(v.src);
    };
    v.onerror = () => resolve({ w: 1280, h: 720, duration: 0 });
    v.src = URL.createObjectURL(file);
  });
}

// Compress photos in the browser before upload (GIFs are kept as-is so they still animate)
export async function prepareImage(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  if (/heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name)) return file; // Cloudinary converts HEIC
  return imageCompression(file, { maxSizeMB: 0.6, maxWidthOrHeight: 1800, useWebWorker: true, initialQuality: 0.85 });
}
