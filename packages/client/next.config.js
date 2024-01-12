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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "posh-crab-317.convex.cloud",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "notable-puffin-749.convex.cloud",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "acoustic-dinosaur-150.convex.cloud",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "prod-practice-question-worker.james-0da.workers.dev",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "dev-practice-question-worker.james-0da.workers.dev",
        pathname: "/**/*",
      },
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
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
