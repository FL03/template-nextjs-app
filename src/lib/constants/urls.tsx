/**
 * Created At: 2025.07.15:11:39:35
 * @author - @FL03
 * @file - constants/urls.ts
 */
// imports
import * as Lucide from "lucide-react";
// project
import { Href } from "@/lib/endpoint";

export const ENDPOINT_ADMIN = "/admin";

// public endpoints
export const ENDPOINT_HOME = "/";
export const ENDPOINT_ABOUT = "/about";
export const ENDPOINT_CONTACT = "/contact";
export const ENDPOINT_NOT_FOUND = "/not-found";
export const ENDPOINT_PRIVACY = "/privacy";
export const ENDPOINT_ERROR = "/error";
export const ENDPOINT_TERMS = "/terms";
export const ENDPOINT_FAQ = "/faq";
export const ENDPOINT_LOGIN = "/auth/login";
export const ENDPOINT_SIGNUP = "/auth/register";
export const ENDPOINT_FORGOT_PASSWORD = "/auth/forgot-password";

export const userProfileEndpoint = (username: string) => `/${username}`;

type SiteLink = {
  href: Href;
  label: string;
  description?: string;
};

type UsernameParams = { username: string };

type AppLinkConfig = {
  [key: string]: (params: UsernameParams) => SiteLink[];
};

export const linkTree = {
  "/": (params: UsernameParams) => {
    return {
      "/portfolio": {
        href: `/${params.username}/portfolio`,
        label: "Portfolio",
        description: "View your portfolio",
      },
    };
  },
  "/about": () => {},
  "/contact": () => {},
  "/privacy": () => {},
  "/terms": () => {},
  "/faq": () => {},
  "/auth/login": () => {},
  "/auth/register": () => {},
  "/auth/forgot-password": () => {},
};

/** The primary list for resolving links within the platform */
export const appLinksConfig: AppLinkConfig = {
  apps: () => [
    {
      label: "Notebook",
      icon: <Lucide.LucideEdit2 />,
      href: "/notebook",
    },
  ],
  profile: ({ username }) => [
    {
      label: "Dashboard",
      icon: <Lucide.ComputerIcon />,
      href: `/${username}/dashboard`,
    },
    {
      label: "Portfolio",
      icon: <Lucide.CoinsIcon />,
      href: `/${username}/portfolio`,
    },
    {
      label: "Profile",
      icon: <Lucide.User2Icon />,
      href: `/${username}`,
    },
  ],
  platform: ({ username }) => [
    {
      label: "About",
      icon: <Lucide.RssIcon />,
      href: "/about",
    },
    {
      label: "Notifications",
      icon: <Lucide.BellIcon />,
      href: {
        pathname: "/notifications",
        query: {
          filter: "all",
          sortBy: "newest",
          username,
        },
      },
    },
    {
      label: "Settings",
      icon: <Lucide.SettingsIcon />,
      href: {
        pathname: `/settings`,
        query: { defaultTab: "system" },
      },
    },
  ],
};

export const links: SiteLink[] = [
  {
    href: ENDPOINT_HOME,
    label: "Home",
    description: "Go to the homepage",
  },
  {
    href: ENDPOINT_ABOUT,
    label: "About Us",
    description: "Learn more about us",
  },
  {
    href: ENDPOINT_CONTACT,
    label: "Contact Us",
    description: "Get in touch with us",
  },
  {
    href: ENDPOINT_PRIVACY,
    label: "Privacy Policy",
    description: "Read our privacy policy",
  },
  {
    href: ENDPOINT_TERMS,
    label: "Terms of Service",
    description: "Review our terms of service",
  },
  {
    href: ENDPOINT_FAQ,
    label: "FAQ",
    description: "Frequently Asked Questions",
  },
];

export default links;
