/**
 * Created At: 2025.05.12:23:20:21
 * @author - @FL03
 * @file - layout.tsx
 */
// imports
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
// vercel
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// project
import { PlatformProvider } from "@/features/platform";
import { cn } from "@/lib/utils";
// stylesheet(s)
import "@/styles/globals.css";
import { publicSiteUrl } from "@/lib/config";

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
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 * @param {Readonly<React.PropsWithChildren>} props - the props for the layout; **note** that children are readonly and required.
 */
export default async function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  // get the cookies
  const {
    defaultTheme,
  } = await cookies().then(
    (store) => ({
      defaultTheme: store.get("theme")?.value,
    }),
  );
  // render the layout
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Puzzled" />
      </head>
      <body
        className={cn(
          "antialiased relative z-0",
          "flex flex-col flex-1 min-h-screen w-full",
          geistMono.variable,
          geistSans.variable,
        )}
      >
        <main className="flex-1 h-full w-full">
          <PlatformProvider defaultTheme={defaultTheme}>
            {children}
          </PlatformProvider>
        </main>
        {/* Sonner Toasts */}
        <Toaster />
        {/* Vercel */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: { absolute: "Puzzled", template: "%s | pzzld" },
  applicationName: "Tip Tracker",
  category: "Technology",
  classification: "application",
  creator: "Scattered-Systems, LLC",
  description: "Track, manage, and analyze your tips with ease.",
  publisher: "Scattered-Systems, LLC",
  metadataBase: publicSiteUrl,
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
    "shifts",
    "tips",
    "finance",
    "manage",
    "analytics",
    "dashboard",
  ],
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "icon",
      url: "/icon0.svg",
      type: "image/svg+xml",
    },
    {
      rel: "icon",
      url: "/icon1.png",
      type: "image/png",
    },
  ],
  openGraph: {
    emails: ["support@pzzld.org", "support@scsys.io"],
    siteName: "pzzld_org_tips",
    locale: "en_US",
    type: "website",
    url: publicSiteUrl,
    images: [
      {
        alt: "Puzzled Icon",
        url: "/assets/icon.png",
        width: 512,
        height: 512,
        type: "image/png",
      },
      {
        alt: "Puzzled Logo",
        url: "/assets/pzzld.svg",
        type: "image/svg+xml",
      },
    ],
  },
};
