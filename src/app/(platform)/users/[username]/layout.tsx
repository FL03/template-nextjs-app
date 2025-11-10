/**
 * Created At: 2025.07.05:19:55:45
 * @author - @FL03
 * @file - user/layout.tsx
 */
"use server";
// imports
import * as React from "react";
// components
import { UserProfileProvider } from "@/features/profiles";

type RouteParams = {
  params: Promise<{ username: string }>;
};

export default async function Layout({
  children,
  params,
}: Readonly<React.PropsWithChildren<RouteParams>>) {
  const { username } = await params;

  return (
    <UserProfileProvider username={username}>
      <div className="container mx-auto flex-1 h-full w-full">
        {children}
      </div>
    </UserProfileProvider>
  );
}
Layout.displayName = "UserProfileLayout";

export async function generateMetadata(
  { params }: RouteParams,
  parent: import("next").ResolvingMetadata,
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
