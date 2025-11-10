/**
 * Created At: 2025.10.11:19:37:02
 * @author - @FL03
 * @directory - src/app/(platform)/[username]/settings
 * @file - page.tsx
 */
import { ProfileSettings } from "@/features/profiles";
import { ResolvingMetadata } from "next";

type RoutePropsT = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: RoutePropsT) {
  const { username } = await params;
  return (
    <div className="container mx-auto flex-1 h-full w-full">
      <ProfileSettings username={username} />
    </div>
  );
}
Page.displayName = "ProfileSettingsPage";

export async function generateMetadata(
  { params }: RoutePropsT,
  parent: ResolvingMetadata,
) {
  const { username } = await params;
  const parentMeta = await parent;
  return {
    ...parentMeta,
    title: `Settings - ${username}`,
    description: [
      `Manage settings and preferences for the user ${username} on Pzzld Org Tips.`,
      parentMeta.description,
    ].join(" "),
  };
}
