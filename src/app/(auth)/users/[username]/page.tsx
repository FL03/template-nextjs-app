'use server';
// imports
import { ResolvingMetadata } from 'next';
// project
import { logger } from '@/lib/logger';
// components
import { ProfileScreen } from '@/features/users/profiles';

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  // await the routes params
  const { username } = await params;
  // await the routes search params
  const { view } = await searchParams;
  // trace the event
  logger.trace(`Viewing profile screen for ${username} using the ${view} view`);
  // render the profile screen
  return <ProfileScreen username={username} view={view} />;
}
Page.displayName = 'UserProfilePage';

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
    description: `The user-profile page for ${username}`,
    title: `Profile (@${username})`,
  };
}
