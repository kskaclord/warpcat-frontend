/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ÖNEMLİ: static export KAPALI (bu dosyada output: 'export' YOK)
  images: { unoptimized: true }, // og.png için cache/opt. gereksiz
};

module.exports = nextConfig;
