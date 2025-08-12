/**
 * Created At: 2025-04-09:22:27:42
 * @author - @FL03
 * @file - editor/page.tsx
 */
// imports
import { type Metadata } from "next";
// features
import { DocumentEditor } from "@/components/common/text-editor";

// page metadata
export const metadata: Metadata = {
  title: "Editor",
};

export default function Page() {
  // render the page
  return <DocumentEditor />;
}
Page.displayName = "TextEditorPage";
