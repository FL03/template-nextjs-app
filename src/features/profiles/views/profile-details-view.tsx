/**
 * Created At: 2025.08.08:13:53:23
 * @author - @FL03
 * @file - profile-details-view.tsx
 */
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';

export const ProfileDetailsView: React.FC<{ className?: string }> = ({
  className,
}) => {
  // dynamically import the profile details component
  const Comp = dynamic(
    async () =>
      await import('../widgets/profile-details').then(
        (mod) => mod.ProfileDetails,
      ),
    {
      ssr: false,
    },
  );
  return <Comp className={className} />;
};
ProfileDetailsView.displayName = 'ProfileDetailsView';

export default ProfileDetailsView;
