const path = require('path');
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
    // Alias 설정 추가
    config.resolve.alias['@next-translate-root/locales'] = path.resolve(__dirname, 'locales');
    return config;
  },
  output: 'standalone',
};

module.exports = nextTranslate(nextConfig);
