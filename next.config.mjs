import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
 images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' }, // ImgBB
      { protocol: 'https', hostname: 'res.cloudinary.com' }, // Cloudinary
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }, // Firebase
      { protocol: 'https', hostname: '**' }, // Wildcard for safety
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);