/**
 * Created At: 2025.07.05:23:00:44
 * @author - @FL03
 * @file - [username]/page.tsx
 */
"use server";
// components
import { ProfileDetailsView } from "@/features/profiles";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function Page() {
  return (
    <div className="flex-1 h-full w-full container mx-auto">
      <ProfileDetailsView />
    </div>
  );
}
Page.displayName = "UserProfilePage";

export async function generateMetadata(
  { params }: PageProps,
  parent: import("next").ResolvingMetadata,
) {
  const { username } = await params;
  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];

  return {
    ...parentMetadata,
    openGraph: {
      ...parentMetadata.openGraph,
      images: [...previousImages],
    },
    description: `The user profile for @${username}`,
    title: `@${username}`,
  };
}
