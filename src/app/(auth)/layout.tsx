/**
 * Created At: 2025.05.13:21:40:18
 * @author - @FL03
 * @file - layout.tsx
 * @description - This is a protected layout enabled for all authenticated route; /*
 */
import { PropsWithChildren } from 'react';
// components
import { PlatformScaffold } from '@/components/platform';
import { AuthProvider } from '@/features/auth';
/**
 * The base layout for authenticated routes
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 * @param {Readonly<PropsWithChildren>} props - the props for the template; note that children
 * are readonly and required.
 */
export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <AuthProvider>
      <PlatformScaffold>{children}</PlatformScaffold>
    </AuthProvider>
  );
}
Layout.displayName = 'AuthLayout';
