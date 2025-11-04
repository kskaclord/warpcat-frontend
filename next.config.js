/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // static export KAPALI; burada output: 'export' YOK
  images: { unoptimized: true },
};
module.exports = nextConfig;
