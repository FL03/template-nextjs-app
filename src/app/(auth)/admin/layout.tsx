// imports
import { PropsWithChildren } from 'react';

export default function Layout({ children }: Readonly<PropsWithChildren>) {

  return (
    <div className="flex flex-col flex-1 w-full gap-4">
      {children}
    </div>
  );
}
Layout.displayName = 'AdminLayout';
