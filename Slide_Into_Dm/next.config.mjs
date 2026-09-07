/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:"scontent.cdninstagram.com"
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/proxyBusiness', // Add this to your proxy API route
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow all origins (you can restrict this to specific domains)
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
}

export default nextConfig
