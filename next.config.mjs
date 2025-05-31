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

    // Explicitly include node_modules for Three.js packages
    config.module.rules.push({
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: [
        /node_modules\/three/,
        /node_modules\/@react-three\/fiber/,
        /node_modules\/@react-three\/drei/
      ],
      use: 'next-babel-loader'
    });

    return config;
  },
  // Ensure proper transpilation of Three.js
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  // Experimental features to help with Three.js
  experimental: {
    esmExternals: 'loose'
  },
  // Babel configuration
  babel: {
    presets: ['next/babel'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods',
      '@babel/plugin-proposal-private-property-in-object'
    ]
  }
}

export default nextConfig;
