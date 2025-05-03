/*
  Appellation: profile-dashboard <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/common/loaders';
import ProfileProvider from '../provider';

type ScreenProps = {
  username?: string;
  view?: string;
  asChild?: boolean;
};
export const ProfileScreen: React.FC<ScreenProps> = ({ username, view = 'dashboard' }) => {

  const Dashboard = dynamic(
    async () => await import('../widgets/profile-dashboard'),
    {
      ssr: false,
      loading: () => <Spinner showLabel className="m-auto" />,
    }
  );
  const Details = dynamic(
    async () => await import('../widgets/profile-details'),
    {
      ssr: false,
      loading: () => <Spinner showLabel className="m-auto" />,
    }
  );
  const renderView = () => {
    switch (view) {
      case 'details':
        return <Details />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProfileProvider username={username}>
      {renderView()}
    </ProfileProvider>
  );
};
ProfileScreen.displayName = 'ProfileScreen';

export default ProfileScreen;
