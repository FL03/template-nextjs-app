/*
  Appellation: page <settings>
  Contrib: @FL03
*/
"use server";
// project
import { SettingScreen } from "@/features/settings";

type RoutePropsT = {
  searchParams: Promise<{
    defaultTab?: string;
    username?: string;
    userId?: string;
  }>;
};

export default async function Page({ searchParams }: RoutePropsT) {
  // await the search parameters
  const { defaultTab } = await searchParams;
  // render the settings screen
  return <SettingScreen defaultTab={defaultTab} />;
}
Page.displayName = "SettingsPage";
