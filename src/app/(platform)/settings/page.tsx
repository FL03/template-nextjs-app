/**
 * Created At: 2025.10.11:20:27:16
 * @author - @FL03
 * @directory - src/app/(platform)/settings
 * @file - page.tsx
 */
// project
import { Section } from "@/components/common/section";
import { SystemSettingsForm } from "@/features/platform";

type RoutePropsT = {
  searchParams: Promise<{
    defaultTab?: string;
  }>;
};

export default async function Page({}: RoutePropsT) {
  // render the settings screen
  return (
    <Section variant="container">
      <SystemSettingsForm />
    </Section>
  );
}
Page.displayName = "SettingsPage";
