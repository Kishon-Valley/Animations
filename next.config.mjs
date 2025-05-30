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
  webpack: (config, { isServer }) => {
    // Handle Three.js and its dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': 'three',
      '@react-three/fiber': '@react-three/fiber',
      '@react-three/drei': '@react-three/drei'
    };

    // Handle node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Handle shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },
  // Ensure proper transpilation of Three.js
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
}

export default nextConfig;
