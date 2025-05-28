import type { NextConfig } from 'next';
import { RemotePattern } from 'next/dist/shared/lib/image-config';

const nextBuildOutput = (): "export" | "standalone" | undefined => {
  const value = process.env['NEXT_PUBLIC_BUILD_OUTPUT'] ?? process.env['BUILD_OUTPUT'];
  return value === 'export' || value === 'standalone' ? value : undefined;
}

const nextConfigImages = (options?: { supabaseProjectUrl?: string }): NextConfig['images'] => {
  let remotePatterns: (URL | RemotePattern)[] = [
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
  ];

  if (options?.supabaseProjectUrl) {
    try {
      const url = new URL(options.supabaseProjectUrl);
      remotePatterns.push({
        hostname: url.hostname,
        pathname: '/storage/**',
        protocol: 'https',
      });
    } catch (error) {
      console.error('Invalid Supabase URL:', options.supabaseProjectUrl, error);
    }
  }

  return {
    remotePatterns: [
      ...remotePatterns,
    ]
  };
}

/**
 * The Next.js configuration file.
 * 
 * Visit the [`next-config-js`](https://nextjs.org/docs/app/api-reference/config/next-config-js) website for more information.
 * @type {NextConfig}
 */
const nextConfig: NextConfig = {
  output: nextBuildOutput(),
  images: nextConfigImages({ supabaseProjectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL }),
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  publicRuntimeConfig: {
    SITE_URL: process.env.SITE_URL,
  },
  turbopack: {
    resolveExtensions: ['js', 'jsx', 'ts', 'tsx'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
};

export default nextConfig;

// const withMDX = createMDX({
//   extension: /\.(md|mdx)$/,
// });

// // Merge MDX config with Next.js config
// export default withMDX(nextConfig);
