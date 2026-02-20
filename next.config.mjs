/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    cacheComponents: true
  },
  images: {
    domains: ["vercel.sh"],
  },
};

export default nextConfig;