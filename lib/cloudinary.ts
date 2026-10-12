import { createHash } from "crypto";

export function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

/** Upload an image buffer to Cloudinary; returns the public HTTPS URL. */
export async function uploadImageToCloudinary(input: {
  bytes: Buffer;
  filename: string;
  mimeType: string;
  folder?: string;
}): Promise<{ url: string; publicId: string; storageKey: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured.");
  }

  const folder =
    input.folder?.trim() ||
    process.env.CLOUDINARY_FOLDER?.trim() ||
    "ggi";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const paramsToSign: Record<string, string> = {
    folder,
    timestamp,
  };
  const signature = signCloudinaryParams(paramsToSign, apiSecret);

  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(input.bytes)], { type: input.mimeType }),
    input.filename,
  );
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form },
  );
  const json = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    error?: { message?: string };
  };

  if (!response.ok || !json.secure_url || !json.public_id) {
    throw new Error(json.error?.message ?? "Cloudinary upload failed.");
  }

  return {
    url: json.secure_url,
    publicId: json.public_id,
    storageKey: json.public_id,
  };
}

function signCloudinaryParams(
  params: Record<string, string>,
  apiSecret: string,
): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}
