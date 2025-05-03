/**
 * Created At: 2025-04-09:23:14:47
 * @author - @FL03
 * @file - links.tsx
 */
import * as Lucide from 'lucide-react';

export type DynamicLink = (
  endpoint: string,
  params?: Record<string, string>,
  searchParams?: Record<string, string> | URLSearchParams | string[][]
) => string;

export type EndpointProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  showIcon?: boolean;
};

export type Href = string | import('@/types').Url | DynamicLink | (() => string);

export type EndpointBuilder<P> = (
  endpoint: string,
  params?: P
) => EndpointProps;

export const platformLinks = (username: string) => {
  return {
    profile: (u?: string | null) => ({
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
          query: { username, view: 'dashboard' },
        },
        icon: <Lucide.PenBoxIcon className="h-4 w-4" />,
        label: 'Blog',
        description: 'Navigate to Blog',
        showIcon: false,
      },
      links: [],
    }),
    fitness: () => ({
      basePath: {
        href: {
          pathname: '/fitness',
          query: { username, view: 'dashboard' },
        },
        icon: <Lucide.DumbbellIcon className="h-4 w-4" />,
        label: 'Fitness',
        description: 'Navigate to Fitness',
        showIcon: false,
      },
      links: [],
    }),
  };
};
