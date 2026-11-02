import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  isR2Configured,
  uploadImageToR2,
  MAX_IMAGE_BYTES,
} from "@/lib/r2";

// الرفع بيتم على Cloudflare R2 مباشرة (من غير ImgBB نهائياً).
// runtime = "nodejs" مطلوب لأن @aws-sdk/client-s3 مش شغال على الـ Edge.
export const runtime = "nodejs";

export async function POST(req: Request) {
  // 1) الرفع من الراوت ده للأدمن بس (ImageUpload بيتستخدم في لوحة التحكم)
  const session = await getSession();
  if (!session?.email) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 2) لازم متغيرات R2 تكون متظبطة على منصة الاستضافة:
  //    R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME /
  //    R2_ENDPOINT (أو CLOUDFLARE_ACCOUNT_ID) / R2_PUBLIC_URL
  if (!isR2Configured()) {
    console.error(
      "[UPLOAD_API_ERROR] R2 is not configured. Set the R2_* environment variables on the hosting platform."
    );
    return NextResponse.json(
      { success: false, error: "Storage is not configured on the server" },
      { status: 500 }
    );
  }

  try {
    // 3) نفس عقد الواجهة القديم بالظبط: FormData فيه "file" و "folder"
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "products";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 10MB" },
        { status: 400 }
      );
    }

    // 4) الرفع على R2 — جوّه uploadImageToR2 فيه تحقق كامل
    //    (النوع، الحجم، الـ magic bytes) والراجع رابط عام:
    //    <R2_PUBLIC_URL>/<folder>/<uuid>.<ext>
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImageToR2(buffer, file.type, folder);

    return NextResponse.json({ success: true, url: result.url });
  } catch (error) {
    console.error("[UPLOAD_API_ERROR]", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}