import type { NextConfig } from "next";

// keep strict quality gates
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    serverExternalPackages: [],
    optimizePackageImports: ['@xterm/xterm', 'monaco-editor']
  },
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  // Environment variables that should be available in the browser
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Disable PostCSS
  webpack: (config, { isServer }) => {
    // Remove PostCSS loader
    config.module.rules = config.module.rules.map((rule: any) => {
      if (typeof rule === 'object' && rule !== null) {
        if (rule.use && Array.isArray(rule.use)) {
          rule.use = rule.use.filter((use: any) => {
            return !use.loader || !use.loader.includes('postcss-loader');
          });
        }
      }
      return rule;
    });
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/health',
        destination: '/api/health',
      },
      {
        source: '/api/ai/:path*',
        destination: '/api/ai/:path*',
      },
    ]
  },
};

export default nextConfig;