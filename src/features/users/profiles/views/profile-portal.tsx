// profile-screen.tsx
'use client';
// imports
import * as React from 'react';
// components
import {
  DashboardContent,
  DashboardScaffold,
} from '@/components/common/dashboard';

type PortalScaffoldProps = {
  asChild?: boolean;
  username?: string;
};

export const UserPortal: React.FC<
  PortalScaffoldProps & React.ComponentPropsWithRef<typeof DashboardScaffold>
> = ({ ref, children, panel, ...props }) => {
  const renderPanel = () => {
    if (!panel) return null;
    return (
      <DashboardContent className="w-full lg:max-w-sm">
        {panel}
      </DashboardContent>
    );
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
UserPortal.displayName = 'UserPortalScaffold';

export default UserPortal;
