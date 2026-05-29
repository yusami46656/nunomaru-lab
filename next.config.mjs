/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/experiments",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/experiments/:path*",
        destination: "/tools/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
