/**
 * Created At: 2025.09.25:16:19:53
 * @author - @FL03
 * @directory - src/features/shifts/views
 * @file - shift-details-page.tsx
 */
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';

type ScreenProps = {
  shiftId?: string;
  username?: string;
  defaultMode?: 'read' | 'update';
  mode?: 'read' | 'update';
};

/** A view responsible for rendering the details of a particular shift */
export const ShiftDetailsView: React.FC<ScreenProps> = ({
  shiftId,
  username,
  defaultMode = 'read',
  mode,
}) => {
  const ShiftDetails = dynamic(
    async () =>
      await import('../widgets/shift-details').then((mod) => mod.ShiftDetails),
    {
      ssr: false,
    },
  );
  return (
    <ShiftDetails
      defaultMode={defaultMode}
      mode={mode}
      shiftId={shiftId}
      username={username}
    />
  );
};
ShiftDetailsView.displayName = 'ShiftDetailsView';

export default ShiftDetailsView;
