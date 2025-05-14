/**
 * Created At: 2025.05.13:21:39:56
 * @author - @FL03
 * @file - page.tsx
 * @description - The main page for the user-profile dashboard. This is the main entry point for all user-profile related pages.
 */
'use server';
// imports
import { ResolvingMetadata } from 'next';
// project
import { logger } from '@/lib/logger';
// components
import { ProfileScreen } from '@/features/profiles';

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { view } = await searchParams;

  // logger
  logger.trace(`Viewing profile dashboard for ${username}`);
  return <ProfileScreen username={username} view={view} />;
}
Page.displayName = 'ProfileDetailsPage';

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
) {
  const { username } = await params;
  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];

  return {
    openGraph: {
      ...parentMetadata.openGraph,
      images: [...previousImages],
    },
    description: `The user-profile for ${username}`,
    title: `Profile (@${username})`,
  };
}
