/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['example.com', 'plohub-bucket.s3.ap-northeast-2.amazonaws.com'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Only dev purpose
      config.devtool = 'cheap-module-source-map';
    }
    return config;
  },
};

module.exports = nextConfig;
