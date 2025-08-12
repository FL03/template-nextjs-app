/**
 * Created At: 2025.07.05:22:14:21
 * @author - @FL03
 * @file - portfolio/layout.tsx
 */
"use server";
// imports
import { ReactNode } from "react";
// components
import { DynamicDashboard } from "@/components/common/dashboard";

type RouteProps = {
  params: Promise<{ username: string }>;
};

type LayoutPropsT = {
  children: ReactNode;
  leading: ReactNode;
  trailing: ReactNode;
} & RouteProps;

export default async function Layout(
  { children, leading, trailing }: LayoutPropsT,
) {
  // render the layout for the user portfolio
  return (
    <DynamicDashboard
      hideDescription
      leading={leading}
      trailing={trailing}
      title="Portfolio"
      description="A unified view of your financial portfolio"
    >
      {children}
    </DynamicDashboard>
  );
}
Layout.displayName = "UserPortfolioLayout";

export async function generateMetadata(
  { params }: RouteProps,
  parent: import("next").ResolvingMetadata,
) {
  // await and destructure the params
  const { username } = await params;
  // get the parent metadata
  const parentMetadata = await parent;

  return {
    ...parentMetadata,
    description: `The financial portfolio of ${username}`,
    title: "Portfolio",
  };
}
