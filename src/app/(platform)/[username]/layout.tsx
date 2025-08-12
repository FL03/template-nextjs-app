/**
 * Created At: 2025.05.16:12:23:35
 * @author - @FL03
 * @file - [username]/layout.tsx
 */
"use server";
// imports
import { PropsWithChildren } from "react";
// components
import { ProfileProvider } from "@/features/profiles";

type RouteParams = {
  params: Promise<{ username: string }>;
};

/**
 * The base layout for authenticated routes
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 * @param {Readonly<PropsWithChildren>} props - the props for the template; note that children
 * are readonly and required.
 */
export default async function Layout(
  { children, params }: Readonly<PropsWithChildren> & RouteParams,
) {
  const { username } = await params;
  return (
    <ProfileProvider username={username}>
      {children}
    </ProfileProvider>
  );
}
Layout.displayName = "UserLayout";
