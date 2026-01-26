/**
 * Created At: 2025.07.27:10:08:38
 * @author - @FL03
 * @file - shifts/page.tsx
 */
// project
import { ShiftDetailsView } from "@/features/shifts";
import { ResolvingMetadata } from "next";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    defaultMode?: "read" | "update";
    mode?: "read" | "update";
  }>;
};

export default async function Page(
  { params, searchParams }: RouteProps,
) {
  const { id } = await params;
  const { defaultMode = "read", mode } = await searchParams;
  // render the page
  return (
    <ShiftDetailsView
      shiftId={id}
      defaultMode={defaultMode}
      mode={mode}
    />
  );
}
Page.displayName = "ShiftDetailPage";

export async function generateMetadata(
  { params }: RouteProps,
  parent: ResolvingMetadata,
) {
  const { ...meta } = await parent;
  const { id } = await params;
  return {
    ...meta,
    description: "View the details of a shift",
    title: `Shift ${id}`,
  };
}
