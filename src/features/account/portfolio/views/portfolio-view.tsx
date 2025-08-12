/**
 * Created At: 2025.07.05:22:15:37
 * @author - @FL03
 * @file - portfolio-view.tsx
 */
"use client";
// imports
import * as React from "react";
import dynamic from "next/dynamic";
import { DynamicDashboard } from "@/components/common/dashboard";
import { Spinner } from "@/components/common/loaders";
import PortfolioProvider from "../provider";

/** This component renders the portfolio view for the user. */
export const PortfolioView: React.FC = () => {
  // log the event
  const Content = dynamic(
    async () =>
      await import("../widgets/dashboard").then((mod) =>
        mod.PortfolioDashboardContent
      ),
    {
      ssr: false,
      loading: () => (
        <div className="flex flex-1 items-center justify-center h-full w-full">
          <Spinner showLabel />
        </div>
      ),
    },
  );
  // import the leading component
  const Leading = dynamic(
    async () =>
      await import("../widgets/dashboard").then((mod) =>
        mod.PortfolioLeadingPanel
      ),
    {
      ssr: false,
      loading: () => (
        <div className="flex flex-1 items-center justify-center h-full w-full">
          <Spinner showLabel />
        </div>
      ),
    },
  );
  // import the trailing component
  const Trailing = dynamic(
    async () =>
      await import("../widgets/dashboard").then((mod) =>
        mod.PortfolioDashboardTrailing
      ),
    {
      ssr: false,
      loading: () => (
        <div className="flex flex-1 items-center justify-center h-full w-full">
          <Spinner showLabel />
        </div>
      ),
    },
  );

  // render the portfolio view
  return (
    <PortfolioProvider>
      <DynamicDashboard
        className=""
        leading={<Leading />}
        trailing={<Trailing />}
      >
        <Content />
      </DynamicDashboard>
    </PortfolioProvider>
  );
};
PortfolioView.displayName = "PortfolioView";

export default PortfolioView;
