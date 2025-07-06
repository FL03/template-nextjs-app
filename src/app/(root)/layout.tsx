/**
 * Created At: 2025.07.05:08:23:57
 * @author - @FL03
 * @file - layout.tsx
 */
import { PropsWithChildren } from 'react';
import { PlatformScaffold } from '@/components/platform/platform-scaffold';

/**
 * The layout for all _root_ pages; i.e. all non-authenticated pages fallback onto this layout.
 *
 */
export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return <PlatformScaffold>{children}</PlatformScaffold>;
}
Layout.displayName = 'AppLayout';
