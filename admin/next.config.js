module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plohub-bucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
      },
    ],
  },
  videos: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plohub-bucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
      },
    ],
  },
};
