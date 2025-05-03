/**
 * Created At: 2025-04-12:14:57:03
 * @author - @FL03
 * @file - template.tsx
 */
'use client';
// imports
import * as React from 'react';

export default function Template({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <div className="flex-1 min-h-full w-full">
      {children}
    </div>
  );
}
Template.displayName = 'AppTemplate';
