import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // تجاهل مسارات الأدمن و API
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    // حماية مسارات الأدمن
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      const session = req.cookies.get("session")?.value;
      if (!session) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
    return NextResponse.next();
  }

  // دع next-intl يتكفل بباقي المسارات (بما فيها تحويل / إلى /ar)
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};