module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plohub-bucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "d190dv1poq5i84.cloudfront.net",
        port: "",
      },
    ],
  },
  output: "standalone",
};
