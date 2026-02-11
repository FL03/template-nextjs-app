/**
 * Created At: 2025.09.23:19:48:58
 * @author - @FL03
 * @directory - src/features/orgs/providers
 * @file - orgs-provider.tsx
 */
'use client';
// imports
import * as React from 'react';
// hooks
import { useOrgs } from '@/hooks/use-orgs';
// local

type OrganizationsContext = {} & ReturnType<typeof useOrgs>;

const OrganizationsContext = React.createContext<
  OrganizationsContext | undefined
>(undefined);

/**
 * The `useOrganizations` hook provides access to the context of the `OrganizationsProvider`, enabling users to interact with their
 * created organizations.
 */
export const useOrganizations = (): OrganizationsContext => {
  const context = React.useContext(OrganizationsContext);
  if (!context) {
    throw new Error(
      'The `useOrganizations` hook must be used within the bounds of an OrganizationsProvider.',
    );
  }
  return context;
};

export const OrganizationsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data, ...hook } = useOrgs({});
  // memoize the context
  const ctx = React.useMemo(
    () => ({
      data,
      ...hook,
    }),
    [data, hook],
  );
  // render the provider context
  return <OrganizationsContext value={ctx}>{children}</OrganizationsContext>;
};
