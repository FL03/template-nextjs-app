'use client';
// imports
import { PropsWithChildren } from 'react';
// components
import { PlatformScaffold } from '@/components/platform';

export default function Layout({ children }: Readonly<PropsWithChildren>) {

  return <PlatformScaffold>{children}</PlatformScaffold>;
}
Layout.displayName = 'UsersLayout';
