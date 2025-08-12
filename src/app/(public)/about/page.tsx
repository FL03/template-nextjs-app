/**
 * Created At: 2025.05.28:12:07:02
 * @author - @FL03
 * @file - about/page.tsx
 */
// imports
import { AboutScreen } from "@/features/platform";

export default function Page() {
  return <AboutScreen />;
}
Page.displayName = "AboutPage";

// page metadata
export const metadata: import("next").Metadata = {
  title: "About",
}
