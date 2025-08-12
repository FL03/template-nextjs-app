/**
 * Created At: 2025.07.25:06:38:44
 * @author - @FL03
 * @file - terms/page.tsx
 */
// features
import { TermScreen } from "@/features/platform";

export default function Page() {
  // render the page
  return <TermScreen />;
}
Page.displayName = "TermsPage";

// page metadata
export const metadata: import("next").Metadata = {
  title: "Terms & Conditions",
}

