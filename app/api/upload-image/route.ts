import { getInsforgeUploadClient } from "@/lib/insforge-server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function getFileExtension(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop();
  return ext ? `.${ext}` : "";
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: { code: "NO_FILE", message: "No file provided." } },
        { status: 400 }
      );
    }

    // 1. File size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FILE_TOO_LARGE",
            message: `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`,
          },
        },
        { status: 413 }
      );
    }

    // 2. MIME type validation — check against explicit allowlist (do not trust client alone)
    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_FILE_TYPE",
            message: "Only JPEG, PNG, GIF, and WebP images are allowed.",
          },
        },
        { status: 415 }
      );
    }

    // 3. File extension validation — must match the declared MIME type
    const extension = getFileExtension(file.name);
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_FILE_EXTENSION",
            message: "File extension is not allowed.",
          },
        },
        { status: 415 }
      );
    }

    // 4. Magic bytes validation — read first few bytes to verify actual file type
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    if (!isValidImageMagicBytes(bytes, mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_FILE_CONTENT",
            message: "File content does not match the declared type.",
          },
        },
        { status: 415 }
      );
    }

    // 5. Server-generated key — user cannot control storage path
    const safeFileName = sanitizeFileName(file.name);
    const key = `images/${userId}/${Date.now()}-${safeFileName}`;

    const insforge = getInsforgeUploadClient();

    // Re-create a Blob from the already-read buffer to avoid reading the stream twice
    const uploadBlob = new Blob([arrayBuffer], { type: mimeType });

    const { data, error } = await insforge.storage
      .from("lemon")
      .upload(key, uploadBlob);

    if (error) {
      console.error("[upload-image] Storage upload error:", error);
      return NextResponse.json(
        { success: false, error: { code: "UPLOAD_FAILED", message: "Failed to upload image." } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        image: {
          key: data?.key,
          url: data?.url,
        },
      },
    });
  } catch (error) {
    console.error("[upload-image] Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to upload image." } },
      { status: 500 }
    );
  }
}

/**
 * Validates file magic bytes to ensure the actual content matches the declared MIME type.
 * This prevents uploading files that have a renamed extension (e.g., malware.exe → image.jpg).
 */
function isValidImageMagicBytes(bytes: Uint8Array, mimeType: string): boolean {
  if (bytes.length < 4) return false;

  switch (mimeType) {
    case "image/jpeg":
    case "image/jpg":
      // JPEG: FF D8 FF
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

    case "image/png":
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      return (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47
      );

    case "image/gif":
      // GIF: 47 49 46 38 (GIF8)
      return (
        bytes[0] === 0x47 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x38
      );

    case "image/webp":
      // WebP: 52 49 46 46 ?? ?? ?? ?? 57 45 42 50
      return (
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes.length >= 12 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      );

    default:
      return false;
  }
}
