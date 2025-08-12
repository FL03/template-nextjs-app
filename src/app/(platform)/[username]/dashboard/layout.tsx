/**
 * Created At: 2025.07.05:19:55:45
 * @author - @FL03
 * @file - user/layout.tsx
 */
// imports
import { ReactNode } from "react";
// components
import { DynamicDashboard } from "@/components/common/dashboard";

// metadata for the user dashboard
export const metadata: import("next").Metadata = {
  title: "Dashboard",
  description: "User profile dashboard",
};

type LayoutPropsT = {
  children: ReactNode;
  leading: ReactNode;
  trailing: ReactNode;
};

export default function Layout({
  children,
  leading,
  trailing,
}: LayoutPropsT) {
  return (
    <DynamicDashboard
      hideDescription
      leading={leading}
      trailing={trailing}
      title="Dashboard"
      description="The home for all major user actions, information, subscriptions, and more."
    >
      {children}
    </DynamicDashboard>
  );
}
Layout.displayName = "UserDashboardLayout";
