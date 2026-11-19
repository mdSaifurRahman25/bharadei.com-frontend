import { NextRequest, NextResponse } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuth();
    const handlers = toNextJsHandler(auth);
    return handlers.GET(request);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Authentication service unavailable",
      },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuth();
    const handlers = toNextJsHandler(auth);
    return handlers.POST(request);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Authentication service unavailable",
      },
      { status: 503 }
    );
  }
}
