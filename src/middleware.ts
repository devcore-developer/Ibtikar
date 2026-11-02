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

  // العميل اللي فاتح الموقع من غير بادئة لغة في الرابط (زي "/")
  // لو عنده تفضيل لغة محفوظ في كوكي NEXT_LOCALE بنحترمه هنا.
  // (localeDetection: false في routing.ts وقّف قراءة الكوكي جوه next-intl
  //  عشان نستبعد لغة المتصفح تماماً، فبنقرأ الكوكي يدوياً في المكان ده بس)
  const firstSegment = pathname.split("/")[1];
  const hasLocalePrefix = firstSegment === "ar" || firstSegment === "en";
  if (!hasLocalePrefix) {
    const saved = req.cookies.get("NEXT_LOCALE")?.value;
    if (saved === "ar" || saved === "en") {
      const url = req.nextUrl.clone();
      url.pathname = `/${saved}${pathname === "/" ? "" : pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // دع next-intl يتكفل بباقي المسارات (بما فيها تحويل / إلى /ar)
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};