export const FAMILY_MEDIA_BUCKET = "family-media";
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif"]);

export class PhotoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PhotoError";
  }
}

export function fileExtension(file: { name: string; type: string }): string {
  const fromName = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (ALLOWED_EXTENSIONS.has(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  const type = file.type.toLowerCase();
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("heic") || type.includes("heif")) return "heic";
  return "jpg";
}

export function validatePhotoFile(file: { name: string; type: string; size: number }): void {
  if (file.size <= 0) {
    throw new PhotoError("Choose a photo to upload.");
  }
  if (file.size > MAX_PHOTO_BYTES) {
    throw new PhotoError("That photo is larger than 10 MB. Choose a smaller one.");
  }
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const typeOk = !file.type || ALLOWED_TYPES.has(file.type.toLowerCase());
  const extOk = !extension || ALLOWED_EXTENSIONS.has(extension);
  if (!typeOk && !extOk) {
    throw new PhotoError("Use a JPEG, PNG, WebP, or HEIC photo.");
  }
}

export function familyMediaPath(familyId: string, kind: "updates" | "birth", fileName: string): string {
  return `families/${familyId}/${kind}/${fileName}`;
}

export function familyMediaPublicUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${FAMILY_MEDIA_BUCKET}/${path}`;
}
