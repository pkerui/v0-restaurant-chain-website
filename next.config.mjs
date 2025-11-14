/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 注释掉 output: 'export' 以支持服务器端功能（管理后台）
  // output: 'export',
}

export default nextConfig