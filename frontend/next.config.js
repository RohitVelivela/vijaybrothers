/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    // remotePatterns: [
    //   {
    //     protocol: 'http',
    //     hostname: 'localhost',
    //     port: '8080',
    //     pathname: '/uploads/products/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'vijaybrothers.in',
    //     pathname: '/uploads/products/**',
    //   },
    // ],
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'}/:path*`,
      },
    ];
  },
  output: 'export',
};

export default nextConfig;

