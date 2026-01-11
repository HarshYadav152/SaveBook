/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    // Completely disable ESLint during builds
    ignoreDuringBuilds: true,
  },
    async redirects() {
    return [
      {
        source: '/docs',
        destination: 'https://harshyadav152.github.io/SaveBook',
        permanent: false,
        basePath: false
      },
    ];
  },
};

export default nextConfig;
