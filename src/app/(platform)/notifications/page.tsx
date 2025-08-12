/**
 * Created At: 2025.07.27:10:08:38
 * @author - @FL03
 * @file - notifications/page.tsx
 */
import { Metadata } from "next";
// project
import { NotificationScreen } from "@/features/notifications";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View and manage all of your notifications.",
};

type RouteParamsT = {
  searchParams: Promise<
    {
      filter?: string;
      limit?: number;
      sortBy?: string;
      username?: string;
      userId?: string;
    }
  >;
};

export default async function Page({
  searchParams,
}: RouteParamsT) {
  // await the search parameters
  const { username } = await searchParams;
  // render the page
  return <NotificationScreen username={username} />;
}
Page.displayName = "NotificationsPage";
