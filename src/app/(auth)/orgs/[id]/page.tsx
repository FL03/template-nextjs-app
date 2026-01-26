/**
 * Created At: 2025.10.02:20:17:31
 * @author - @FL03
 * @directory - src/app/(platform)/orgs/[id]
 * @file - page.tsx
 */
// project
import { OrgDetails } from "@/features/orgs";

type RouteProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
};

export default async function Page({ params, searchParams }: RouteProps) {
  const { id } = await params;
  const { mode = "read" } = await searchParams;
  return <OrgDetails orgId={id} defaultMode={mode} />;
}
