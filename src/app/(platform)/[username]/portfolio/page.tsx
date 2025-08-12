/**
 * Created At: 2025.07.05:22:14:21
 * @author - @FL03
 * @file - portfolio/page.tsx
 */
"use server";
// project
import { logger } from "@/lib/logger";
// components
import { PortfolioDashboardContent } from "@/features/account/portfolio";

type RouteProps = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: RouteProps) {
  // extract the username from the params
  const { username } = await params;
  // trace the rendering of the portfolio page
  logger.trace(`Rendering portfolio page for user: ${username}`);
  // render the portfolio dashboard
  return <PortfolioDashboardContent />;
}
Page.displayName = "UserPortfolioPage";
