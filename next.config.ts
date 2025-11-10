/**
 * Created At: 2025.07.05:20:42:27
 * @author - @FL03
 * @file - next.config.ts
 */
// imports
import type { NextConfig } from "next";
// markdown
import createMDX from "@next/mdx";
// types
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const nextBuildOutput = (): "export" | "standalone" | undefined => {
  const value = process.env["NEXT_PUBLIC_BUILD_OUTPUT"] ??
    process.env["BUILD_OUTPUT"];
  return value === "export" || value === "standalone" ? value : undefined;
};

const nextConfigImages = (
  { supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL } = {},
): NextConfig["images"] => {
  let remotePatterns: (URL | RemotePattern)[] = [
    {
      hostname: "images.unsplash.com",
      pathname: "/**",
      protocol: "https",
    },
    {
      hostname: "avatars.githubusercontent.com",
      pathname: "/**",
      protocol: "https",
    },
  ];
  // if a supabase project url is available, add it to the remote patterns
  if (supabaseProjectUrl) {
    try {
      const url = new URL(supabaseProjectUrl);
      remotePatterns.push({
        hostname: url.hostname,
        pathname: "/storage/**",
        protocol: "https",
      });
    } catch (error) {
      console.error("Invalid Supabase URL:", supabaseProjectUrl, error);
    }
  }

  return {
    remotePatterns: [
      ...remotePatterns,
    ],
  };
};

/**
 * The Next.js configuration file.
 *
 * Visit the [`next-config-js`](https://nextjs.org/docs/app/api-reference/config/next-config-js) website for more information.
 * @type {NextConfig}
 */
const nextConfig: NextConfig = {
  compress: true,
  output: nextBuildOutput(),
  images: nextConfigImages(),
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

// define the MDX configuration
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [],
  },
});

export default withMDX(nextConfig);
