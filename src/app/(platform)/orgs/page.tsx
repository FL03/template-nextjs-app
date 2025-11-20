/**
 * Created At: 2025.10.02:18:58:34
 * @author - @FL03
 * @directory - src/app/(platform)/[username]/orgs
 * @file - page.tsx
 */
import { OrgsListView } from "@/features/orgs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizations - Platform",
  description: "View and manage your organizations on the platform.",
};

export default function Page() {
  return <OrgsListView />;
}
