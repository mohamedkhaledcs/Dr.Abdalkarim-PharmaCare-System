/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
}

module.exports = nextConfig