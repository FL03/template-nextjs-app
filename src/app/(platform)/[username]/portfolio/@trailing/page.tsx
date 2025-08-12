/**
 * Created At: 2025.07.22:20:13:32
 * @author - @FL03
 * @file - @trailing/page.tsx
 */
"use server";
// imports
import { PortfolioDashboardTrailing } from "@/features/account/portfolio";

type RouteProps = {
  params: Promise<{ username: string }>;
};

async function Page({ params }: RouteProps) {
  // await the params to get the username
  const { username } = await params;
  // render the trailing view
  return <PortfolioDashboardTrailing username={username} />;
}
Page.displayName = "PortfolioTrailingPage";
// export the page as default
export default Page;
