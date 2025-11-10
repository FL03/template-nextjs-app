/**
 * Created At: 2025.07.25:06:38:44
 * @author - @FL03
 * @file - terms/page.tsx
 */
// features
import { HelpPage } from "@/features/platform";

export default function Page() {
  // render the page
  return <HelpPage />;
}
Page.displayName = "HelpPage";

// page metadata
export const metadata: import("next").Metadata = {
  title: "HelpDesk",
  description: "Get help and support for using our application.",
};
