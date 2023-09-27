/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "posh-crab-317.convex.cloud",
      "img.clerk.com",
      "images.clerk.dev",
      "notable-puffin-749.convex.cloud",
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // experimental: {
  //   serverActions: true,
  // },
};
module.exports = nextConfig;
