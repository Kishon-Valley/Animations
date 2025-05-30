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
  // Simplify output for better compatibility
  swcMinify: true,
  webpack: (config) => {
    // This is to handle the BatchedMesh import error
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': 'three'
    };
    return config;
  },
}

export default nextConfig;
