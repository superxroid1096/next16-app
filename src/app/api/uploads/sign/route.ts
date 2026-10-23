import { NextResponse } from "next/server";
import { isActionAuthenticated } from "@/lib/auth/dal";
import { signUploadParameters } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const isAuth = await isActionAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const folder = body.folder || "portfolio/projects";

    const paramsToSign = {
      folder,
    };

    const signed = signUploadParameters(paramsToSign);

    return NextResponse.json({
      ...signed,
      folder,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to generate signature";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
