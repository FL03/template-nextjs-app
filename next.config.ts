/**
 * Created At: 2025.07.05:20:42:27
 * @author - @FL03
 * @file - next.config.ts
 */
// imports
import type { NextConfig } from "next";
// import { withMicrofrontends } from "@vercel/microfrontends/next/config";
// markdown
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
// types
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const nextBuildOutput = (): "export" | "standalone" | undefined => {
  const value = process.env["NEXT_PUBLIC_BUILD_OUTPUT"] ??
    process.env["BUILD_OUTPUT"];
  return value === "export" || value === "standalone" ? value : undefined;
};

const nextConfigImages = (
  options?: { supabaseProjectUrl?: string },
): NextConfig["images"] => {
  // destructure the options and set their defaults
  const { supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL } =
    options || {};
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
  images: nextConfigImages({
    supabaseProjectUrl: process.env["NEXT_PUBLIC_SUPABASE_URL"],
  }),
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  publicRuntimeConfig: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
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
    remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMdx],
  },
});

export default withMDX(nextConfig);
// export default withMicrofrontends(withMDX(nextConfig));
