import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Generates an upload signature for direct browser-to-Cloudinary signed uploads.
 */
export function signUploadParameters(params: Record<string, string | number>): {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
} {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    ...params,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
  };
}

/**
 * Deletes an image from Cloudinary by its publicId.
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (err) {
    console.error("Failed to delete Cloudinary asset:", err);
    return false;
  }
}
