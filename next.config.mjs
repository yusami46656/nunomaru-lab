/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/experiments",
        destination: "/contents",
        permanent: true,
      },
      {
        source: "/experiments/:path*",
        destination: "/contents/:path*",
        permanent: true,
      },
      {
        source: "/tools",
        destination: "/contents",
        permanent: true,
      },
      {
        source: "/tools/:path*",
        destination: "/contents/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
