/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'drive.google.com',
      'images.unsplash.com',
      'user-images.githubusercontent.com',
      'wallpaperaccess.com',
      'http2.mlstatic.com',
      'etecspgov-my.sharepoint.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react', 'react-icons', 'lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(mp3)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[path][name].[hash][ext]',
      },
    });

    return config;
  },
};

module.exports = nextConfig;
