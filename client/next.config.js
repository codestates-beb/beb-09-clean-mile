const nextTranslate = require('next-translate-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'example.com',
      'plohub-bucket.s3.ap-northeast-2.amazonaws.com',
      'gold-cool-goat-213.mypinata.cloud',
      'i.namu.wiki',
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Only dev purpose
      config.devtool = 'cheap-module-source-map';
    }
    return config;
  },
};

module.exports = nextTranslate(nextConfig);
