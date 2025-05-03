/**
 * Created At: 2025-04-03:17:30:51
 * @author - @FL03
 * @description - the root layout for the application
 * @file - layout.tsx
 */
// imports
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
// stylesheet
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  const cookieStore = await cookies();

  const defaultTheme = cookieStore.get('theme')?.value ?? 'system';
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-svh`}
      >
        <ThemeProvider
          enableColorScheme
          enableSystem
          attribute="class"
          storageKey='theme'
          defaultTheme={defaultTheme}
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
  applicationName: 'Template',
  authors: [
    {
      name: 'FL03',
      url: 'https://github.com/FL03',
    },
  ],
  category: 'Technology',
  classification: 'template',
  creator: 'FL03',
  description: 'A template application built with NextJS, React, and TypeScript.',
  icons: [
    {
      url: '/logo.svg',
      sizes: '16x16',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '32x32',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '48x48',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '64x64',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '128x128',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '256x256',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '512x512',
      type: 'image/x-svg',
    },
  ],
  keywords: ['technology', 'network', 'platform', 'virtualization'],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  publisher: 'Scattered-Systems, LLC',
  title: { absolute: 'Scattered-Systems', template: 'scsys (%s)' },
  twitter: {
    card: 'summary',
    creator: '@jo3mccain',
    site: '@blog.scsys.io',
  },
  openGraph: {
    description:
      'A template application built with NextJS, React, and TypeScript.',

    siteName: 'scsys-io',
    locale: 'en_US',
    title: 'Template',
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
