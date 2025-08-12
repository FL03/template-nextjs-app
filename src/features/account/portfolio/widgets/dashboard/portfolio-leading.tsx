/**
 * Created At: 2025.07.27:14:34:51
 * @author - @FL03
 * @file - portfolio-leading.tsx
 */
"use client";
// imports
import * as React from "react";
// components
import { DashboardSection } from "@/components/common/dashboard";
// features
import { WalletBalance, WalletCard } from "@/features/web3";

export const PortfolioLeadingPanel: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof DashboardSection>,
    "children" | "title"
  >
> = ({ ref, className, ...props }) => {
  // render the panel
  return (
    <DashboardSection
      {...props}
      ref={ref}
      className={className}
    >
      <WalletCard className="w-full">
        <WalletBalance />
      </WalletCard>
    </DashboardSection>
  );
};
PortfolioLeadingPanel.displayName = "PortfolioLeadingPanel";

export default PortfolioLeadingPanel;
