import { SITE_URL } from "@/lib/constants";

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/cart', '/checkout'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}