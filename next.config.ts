import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextBuildOutput = (): "export" | "standalone" | undefined => {
  const value = process.env['NEXT_PUBLIC_BUILD_OUTPUT'] ?? process.env['BUILD_OUTPUT'];
  return value === 'export' || value === 'standalone' ? value : undefined;
}

/**
 * The Next.js configuration file.
 * 
 * Visit the [`next-config-js`](https://nextjs.org/docs/app/api-reference/config/next-config-js) website for more information.
 * @type {NextConfig}
 */
const nextConfig: NextConfig = {
  output: nextBuildOutput(),
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'gilqgzjkzkmhbbcqidqb.supabase.co',
        pathname: '/storage/**',
        protocol: 'https',
      },
    ],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  publicRuntimeConfig: {
    SITE_URL: process.env.SITE_URL,
  },
  turbopack: {
    resolveExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
