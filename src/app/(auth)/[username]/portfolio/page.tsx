/**
 * Created At: 2025.07.05:22:14:21
 * @author - @FL03
 * @file - portfolio/page.tsx
 */
'use server';
// imports
import { ResolvingMetadata } from 'next';
// project
import { logger } from '@/lib/logger';
// components
import { UserProfileScreen } from '@/features/users/profiles';

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string; userId?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { view } = await searchParams;

  // logger
  logger.trace(`Viewing profile dashboard for ${username}`);
  return <UserProfileScreen username={username} view={view} />;
}
Page.displayName = 'UserPortfolioPage';

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
