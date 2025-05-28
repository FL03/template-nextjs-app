// profile-screen.tsx
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// components
import {
  DashboardContent,
  DashboardScaffold,
} from '@/components/common/dashboard';

type PortalScaffoldProps = {
  asChild?: boolean;
  username?: string;
};

export const ProfilePortalScaffold: React.FC<
  PortalScaffoldProps & React.ComponentPropsWithRef<typeof DashboardScaffold>
> = ({ ref, children, panel, ...props }) => {
  const renderPanel = () => {
    if (!panel) return null;
    return <DashboardContent className="w-full lg:max-w-sm">{panel}</DashboardContent>;
  };
  // render the component
  return (
    <DashboardScaffold {...props} ref={ref} panel={renderPanel()}>
      <DashboardContent description="Your custom dashboard" title="Content">
        {children}
      </DashboardContent>
    </DashboardScaffold>
  );
};
ProfilePortalScaffold.displayName = 'ProfilePortalScaffold';

export default ProfilePortalScaffold;
