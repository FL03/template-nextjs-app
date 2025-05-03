'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
import { DetailHeader } from '@/components/common/details';

type DashboardProps = {
  description?: React.ReactNode;
  title?: React.ReactNode;
  asChild?: boolean;
};

export const AdminDashboardView: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children' | 'title'> &
    DashboardProps
> = ({ ref, className, description, title, ...props }) => {
  return (
    <div {...props} ref={ref} className={cn('flex flex-col flex-1 gap-4 w-full', className)}>
      <DetailHeader title={title} description={description} className="mb-4" />
    </div>
  );
};
AdminDashboardView.displayName = 'AdminDashboardView';

export default AdminDashboardView;
