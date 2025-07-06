/**
 * Created At: 2025.05.23:00:01:48
 * @author - @FL03
 * @file - layout.tsx
 */
'use server';
// features
import { UserPortal } from '@/features/users/profiles';

type LayoutProps = {
  children: React.ReactNode;
  panel: React.ReactNode;
};
/**
 * A dynamic layout composing two parallel routes into a single user experience.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 */
export default async function Layout({ children, panel }: LayoutProps) {
  // render the parallel layout
  return <UserPortal panel={panel}>{children}</UserPortal>;
}
Layout.displayName = 'DynamicDashboardLayout';
