/**
 * Created At: 2025.10.02:20:16:54
 * @author - @FL03
 * @directory - src/app/(platform)/orgs
 * @file - layout.tsx
 */
// imports
import { OrganizationsProvider } from '@/features/orgs';

export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <OrganizationsProvider>
      <div className='container mx-auto flex-1 h-full w-full'>{children}</div>
    </OrganizationsProvider>
  );
}
Layout.displayName = 'OrgsLayout';
