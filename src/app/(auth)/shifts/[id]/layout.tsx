/**
 * Created At: 2025.08.11:10:46:03
 * @author - @FL03
 * @file - (platform)/layout.tsx
 */

import { WorkShiftProvider } from '@/features/shifts';

type RouteProps = {
  params: Promise<{ id: string }>;
};

/**
 * The base layout for authenticated routes
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 * @param {Readonly<PropsWithChildren>} props - the props for the template; **note** that children are readonly and required.
 */
export default async function Layout({
  children,
  params,
}: Readonly<React.PropsWithChildren> & RouteProps) {
  const { id } = await params;
  return (
    <WorkShiftProvider shiftId={id}>
      <div className='container mx-auto flex-1 h-full w-full'>{children}</div>
    </WorkShiftProvider>
  );
}
