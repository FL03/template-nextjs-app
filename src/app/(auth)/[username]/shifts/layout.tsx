/**
 * Created At: 2025.07.05:22:14:21
 * @author - @FL03
 * @file - shifts/layout.tsx
 */
import { ShiftDashboard, WorkScheduleProvider } from '@/features/shifts';

type WithRouteParams<T = {}> = T & { params: Promise<{ username: string }> };

type WithLayoutProps<T = {}> = T & {
  children: React.ReactNode;
  leading: React.ReactNode;
};

export default async function Layout({
  params,
  children,
  leading,
}: WithLayoutProps<WithRouteParams>) {
  const { username } = await params;
  return (
    <WorkScheduleProvider username={username}>
      <ShiftDashboard leading={leading}>{children}</ShiftDashboard>
    </WorkScheduleProvider>
  );
}
Layout.displayName = 'ShiftDashboardLayout';
