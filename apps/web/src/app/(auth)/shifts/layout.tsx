/**
 * Created At: 2025.05.23:00:01:48
 * @author - @FL03
 * @file - layout.tsx
 */
"use client";
// imports
import { useSearchParams } from "next/navigation";
import { WorkScheduleProvider } from "@/features/shifts";

export default function Layout(
  { children }: Readonly<React.PropsWithChildren>,
) {
  const searchParams = useSearchParams();
  const username = searchParams.get("username")?.toString();
  // render the layout
  return (
    <WorkScheduleProvider username={username}>
      {children}
    </WorkScheduleProvider>
  );
}
Layout.displayName = "ShiftDetailsLayout";
