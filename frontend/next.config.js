/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"], // Add Google profile images
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Suppress webpack cache warnings in development
      config.infrastructureLogging = {
        level: "error",
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/banking/:path*", // Only proxy banking API calls
        destination:
          process.env.BACKEND_URL || "http://localhost:8000/api/banking/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
