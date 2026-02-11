/**
 * Created At: 2025.09.27:15:42:43
 * @author - @FL03
 * @directory - src/features/shifts/views
 * @file - shift-table-view.tsx
 */
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';

export const ShiftTableView: React.FC = () => {
  const Table = dynamic(
    async () =>
      await import('../widgets/shift-table').then((v) => v.ShiftTable),
    { ssr: false },
  );

  return <Table />;
};
ShiftTableView.displayName = 'ShiftTableView';
