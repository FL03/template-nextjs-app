/**
 * Created At: 2025.05.12:23:20:21
 * @author - @FL03
 * @file - layout.tsx
 */
// imports
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
// vercel
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// project
import { UserAuthProvider } from "@/features/auth";
import PlatformProvider from "@/features/platform/provider";
import { cn } from "@/lib/utils";
import { Web3Provider } from "@/lib/web3";

// stylesheet(s)
import "@/public/styles/globals.css"; // './globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * The root layout for the application;
 *
 * @param {Readonly<PropsWithChildren>} children - The children to render.
 */
export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  // get a reference to the cookies
  const cookieStore = await cookies();
  // resolve the default theme
  const defaultTheme = cookieStore.get("theme")?.value;
  // render the layout
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body
        className={cn(
          "flex flex-1 flex-col min-h-dvh w-full relative z-0 m-0 p-0",
          "text-foreground bg-radial-[at_25%_25%] from-background to-background/75",
          geistMono.variable,
          geistSans.variable,
        )}
      >
        <PlatformProvider
          defaultTheme={defaultTheme}
        >
          <UserAuthProvider>
            <Web3Provider>
              {children}
              {/* Sonner Toasts */}
              <Toaster />
              {/* Vercel */}
              <Analytics />
              <SpeedInsights />
            </Web3Provider>
          </UserAuthProvider>
        </PlatformProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  applicationName: "Puzzled",
  category: "Technology",
  classification: "application",
  creator: "FL03",
  description: "",
  metadataBase: new URL("https://app.pzzld.org"),
  publisher: "Scattered-Systems, LLC",
  title: { absolute: "Puzzled", template: "%s | pzzld" },
  authors: [
    {
      name: "Joe McCain III",
      url: "https://github.com/FL03",
    },
    {
      name: "Scattered-Systems, LLC",
      url: "https://scsys.io",
    },
  ],
  keywords: [
    "application",
    "nextjs",
    "react",
    "personal",
    "portfolio",
    "projects",
  ],
  openGraph: {
    description:
      "The puzzled application is home to a portfolio platform containing various projects and experiments.",
    siteName: "pzzld",
    locale: "en_US",
    title: "Puzzled",
    type: "website",
    url: "https://app.pzzld.org",
    images: [
      {
        url: "/favico.svg",
        width: 1200,
        height: 630,
        alt: "Puzzled Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    creator: "@jo3mccain",
    site: "@app.pzzld.org",
    title: "Puzzled",
  },
  icons: [
    {
      url: "/favico.svg",
      sizes: "16x16",
      type: "image/x-svg",
    },
    {
      url: "/favico.svg",
      sizes: "32x32",
      type: "image/x-svg",
    },
    {
      url: "/favico.svg",
      sizes: "48x48",
      type: "image/x-svg",
    },
    {
      url: "/favico.svg",
      sizes: "64x64",
      type: "image/x-svg",
    },
    {
      url: "/favico.svg",
      sizes: "128x128",
      type: "image/x-svg",
    },
    {
      url: "/favico.svg",
      sizes: "256x256",
      type: "image/x-svg",
    },
    {
      url: "/favico.svg",
      sizes: "512x512",
      type: "image/x-svg",
    },
  ],
};
