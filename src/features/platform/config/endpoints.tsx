/**
 * Created At: 2025.09.14:21:13:53
 * @author - @FL03
 * @directory - src/features/platform/config
 * @file - endpoints.tsx
 */
import { CalendarIcon, User2Icon } from "lucide-react";
import { type UrlObject } from "url";

type RouteWithUsername<T = {}> = T & { username: string };

type SiteLink = {
  href: string | UrlObject;
  label: string;
  description?: string;
  icon?: React.ReactNode;
};

type SiteLinkMap = Record<string, SiteLink>;

type SiteLinkHandler<TRoot = {}> = (root: TRoot) => SiteLinkMap;

type SiteLinkBuilder<TParams, TRoot = {}> = (
  params: TParams,
) => SiteLinkHandler<TRoot>;

export const profileLinks = ({ username }: RouteWithUsername) => [
  {
    label: "Profile",
    icon: <User2Icon className="h-5 w-5" />,
    href: {
      pathname: `/${username}`,
    },
  },
];

export const shiftDetailEndpoint: SiteLinkBuilder<{ id: string }> = (
  { id },
) => {
  return () => ({
    details: {
      href: {
        pathname: `/shifts/${id}`,
      },
      label: "Shift Details",
      icon: <CalendarIcon className="h-5 w-5" />,
    },
  });
};
