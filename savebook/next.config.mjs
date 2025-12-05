/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    // Completely disable ESLint during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
