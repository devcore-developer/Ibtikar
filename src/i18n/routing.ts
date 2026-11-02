import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar', // Force Arabic as default
  // Ignore the browser's Accept-Language header so first-time visitors
  // ALWAYS get Arabic. NOTE: in next-intl v4 this also disables the cookie
  // inside the middleware itself, so the saved NEXT_LOCALE cookie is read
  // explicitly in src/middleware.ts to still respect a saved preference.
  localeDetection: false,
  // Persist the saved language preference for 1 year (instead of a
  // browser-session-only cookie). Name/sameSite stay at next-intl defaults.
  localeCookie: { name: 'NEXT_LOCALE', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 }
});