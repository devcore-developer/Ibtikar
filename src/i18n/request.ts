import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { cookies } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  // التحقق من كوكيز الأدمن
  const cookieStore = await cookies();
  const adminLocale = cookieStore.get('admin_locale')?.value;
  if (adminLocale && routing.locales.includes(adminLocale as any)) {
    locale = adminLocale;
  }

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});