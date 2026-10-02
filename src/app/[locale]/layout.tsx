export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { CartProvider } from "@/lib/cart/CartContext"; // تمت إضافة الاستيراد
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  
  return {
    title: isAr ? "ابتكار الخليج | قطع غيار وصيانة الأجهزة الكهربائية" : "Ebtekar Al Khaleej | Appliance Spare Parts & Repair",
    description: isAr 
      ? "قطع غيار أصلية وخدمات صيانة وإصلاح الأجهزة الكهربائية والإلكترونية مع فنيين متخصصين وخدمة موثوقة."
      : "Professional appliance spare parts, maintenance and repair services with specialized technicians and reliable support.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} ${cairo.variable} ${locale === "ar" ? "font-arabic" : "font-sans"}`}
    >
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}