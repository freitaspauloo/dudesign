import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const apexHost = "dudesign.us";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  if (host === "studio.dudesign.us") {
    const destination = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      `https://${apexHost}`,
    );
    return NextResponse.redirect(destination, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};