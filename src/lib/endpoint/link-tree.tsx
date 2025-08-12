/**
 * Created At: 2025.07.19:08:25:39
 * @author - @FL03
 * @file - link-tree.tsx
 */
import * as Lucide from 'lucide-react';
// project
import { LinkProps } from '@/lib/endpoint';

type LinkTreeDynamicLink<
  TParams extends { [key: string]: any } = Record<string, string>,
> = (
  params: TParams,
  searchParams?: URLSearchParams
) => Record<string, LinkProps>;

type LinkTreeValue =
  | (() => Record<string, LinkProps>)
  | LinkTreeDynamicLink<{ [key: string]: any }>;

type LinkTree = Record<string, LinkTreeValue>;

export const platformLinks = {
  profile: (username?: string | null) => ({
    basePath: {
      href: {
        pathname: `/${username}`,
        query: { username, view: 'dashboard' },
      },
      icon: <Lucide.HomeIcon className="h-4 w-4" />,
      label: 'Dashboard',
      description: 'Go to your dashboard',
      showIcon: false,
    },
    links: [
      {
        href: {
          pathname: `/${username}/notifications`,
          query: { username, view: 'dashboard' },
        },
        icon: <Lucide.BellIcon className="h-4 w-4" />,
        label: 'Notifications',
        description: 'Stay updated with notifications',
        showIcon: false,
      },
    ],
  }),
  blog: () => ({
    basePath: {
      href: {
        pathname: '/blog',
        query: { view: 'dashboard' },
      },
      icon: <Lucide.PenBoxIcon className="h-4 w-4" />,
      label: 'Blog',
      description: 'Navigate to Blog',
      showIcon: false,
    },
    links: [],
  }),
};

export const linktree: LinkTree = {
  root: () => ({
    home: {
      href: '/',
      label: 'Home',
    },
    blog: {
      href: '/blog',
      label: 'Blog',
    },
    error: {
      href: '/error',
      label: 'Error',
    },
    'not-found': {
      href: '/not-found',
      label: 'Not Found',
    },
    privacy: {
      href: '/privacy',
      label: 'Privacy Policy',
    },
    terms: {
      href: '/terms',
      label: 'Terms of Service',
    },
  }),
  auth: (params?: { username: string }) => ({
    profile: {
      href: `/${params?.username}`,
      label: 'Profile',
    },
    admin: {
      href: `/${params?.username}/admin`,
      label: 'Dashboard',
    },
    notifications: {
      href: `/${params?.username}/notifications`,
      label: 'Notifications',
    },
    settings: {
      href: `/${params?.username}/settings`,
      label: 'Settings',
    },
    users: {
      href: `/users/${params?.username}`,
      label: 'Users',
    },
  }),
};
