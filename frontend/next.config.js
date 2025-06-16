/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove standalone output for Vercel deployment
  // output: "standalone", // Only needed for Docker
  images: {
    domains: [],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.BACKEND_URL || "http://localhost:8000/api/:path*", // Proxy to backend
      },
    ];
  },
};

module.exports = nextConfig;
