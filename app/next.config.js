const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["via.placeholder.com", "lh3.googleusercontent.com"],
  },
  output: "standalone",
});
