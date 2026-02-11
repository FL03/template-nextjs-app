/**
 * The Next.js configuration file.
 * Created At: 2025.07.05:20:42:27
 * @author - @FL03
 * @file - next.config.ts
 */
// types
import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
// mdx support
import createMDX from "@next/mdx";

function nextBuildOutput(): "export" | "standalone" | undefined {
  const value = process.env["NEXT_PUBLIC_BUILD_OUTPUT"] ??
    process.env["BUILD_OUTPUT"];
  return value === "export" || value === "standalone" ? value : undefined;
}

function nextConfigImages(
  { supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL } = {},
): NextConfig["images"] {
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
    remotePatterns,
  };
}
/**
 * The Next.js configuration object;
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js for more information.
 */
const nextConfig: NextConfig = {
  compress: true,
  distDir: "build",
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

/**

 * @type {NextConfig}
 */
export default withMDX(nextConfig);
