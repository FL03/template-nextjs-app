/**
 * Created At: 2025.07.22:20:13:32
 * @author - @FL03
 * @file - @leading/page.tsx
 */
"use server";
// imports
import { PortfolioLeadingPanel } from "@/features/account/portfolio";

type RouteProps = {
  params: Promise<{ username: string }>;
};

/** Use the server to render the `@leading` slot within the `/[username]/portfolio` layout */
export default async function Page({}: RouteProps) {
  // render the panel
  return <PortfolioLeadingPanel />;
}
Page.displayName = "PortfolioLeadingView";
