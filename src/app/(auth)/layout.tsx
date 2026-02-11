/**
 * Created At: 2025.08.11:10:46:03
 * @author - @FL03
 * @file - (platform)/layout.tsx
 */
import { PlatformScaffold } from '@/features/platform';

/**
 * The base layout for authenticated routes
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 * @param {Readonly<PropsWithChildren>} props - the props for the template; **note** that children are readonly and required.
 */
export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return <PlatformScaffold>{children}</PlatformScaffold>;
}
Layout.displayName = 'PlatformLayout';
