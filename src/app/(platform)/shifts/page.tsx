/**
 * Created At: 2025.09.14:19:24:36
 * @author - @FL03
 * @directory - src/app/(platform)/shifts
 * @file - page.tsx
 */
import type { Metadata } from "next";
// project
import { ShiftTableView } from "@/features/shifts";

export const metadata: Metadata = {
  title: "Shifts",
  description: "A table for viewing all your shifts",
};

export default function Page() {
  return <ShiftTableView />;
}
Page.displayName = "ShiftTablePage";
