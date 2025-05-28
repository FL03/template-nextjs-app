/**
 * Created At: 2025.05.12:23:20:21
 * @author - @FL03
 * @file - layout.tsx
 */
// imports
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';
// stylesheet
import '@/public/styles/globals.css'; // './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * The root layout for the application;
 *
 * @param {Readonly<PropsWithChildren>} children - The children to render.
 *
 */
export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const cookieStore = await cookies();

  const defaultTheme = cookieStore.get('theme')?.value ?? 'system';
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-full z-0`}
      >
        <ThemeProvider
          disableTransitionOnChange
          enableColorScheme
          enableSystem
          attribute="class"
          defaultTheme={defaultTheme}
          storageKey="theme"
          themes={['light', 'dark']}
        >
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  applicationName: 'Template NextJS Platform',
  authors: [
    {
      name: 'Joe McCain III',
      url: 'https://github.com/FL03',
    },
    {
      name: 'Scattered-Systems, LLC',
      url: 'https://scsys.io',
    },
  ],
  category: 'Technology',
  classification: 'application',
  creator: 'FL03',
  description: 'A template application built with Next.js v15, React v19, and Tailwind CSS v4.',
  icons: [
    {
      url: '/favico.svg',
      sizes: '16x16',
      type: 'image/x-svg',
    },
    {
      url: '/favico.svg',
      sizes: '32x32',
      type: 'image/x-svg',
    },
    {
      url: '/favico.svg',
      sizes: '48x48',
      type: 'image/x-svg',
    },
    {
      url: '/favico.svg',
      sizes: '64x64',
      type: 'image/x-svg',
    },
    {
      url: '/favico.svg',
      sizes: '128x128',
      type: 'image/x-svg',
    },
    {
      url: '/favico.svg',
      sizes: '256x256',
      type: 'image/x-svg',
    },
    {
      url: '/favico.svg',
      sizes: '512x512',
      type: 'image/x-svg',
    },
  ],
  keywords: ['scsys', 'template', 'nextjs', 'react', 'tailwindcss', 'typescript', 'supabase'],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  publisher: 'Scattered-Systems, LLC',
  title: { absolute: 'Template', template: 'platform (%s)' },
  twitter: {
    card: 'summary',
    creator: '@jo3mccain',
    site: '@stag.scsys.io',
    title: 'Template NextJS Platform',
  },
  openGraph: {
    description: 'A template application built with Next.js v15, React v19, and Tailwind CSS v4.',

    siteName: 'scsys',
    locale: 'en_US',
    title: 'Template NextJS Platform',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Scattered-Systems, LLC',
      },
    ],
  },
};
