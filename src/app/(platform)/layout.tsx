/**
 * Created At: 2025.08.11:10:46:03
 * @author - @FL03
 * @file - (platform)/layout.tsx
 */
import { PropsWithChildren } from "react";
// features
import { PlatformScaffold } from "@/features/platform";

/**
 * The base layout for authenticated routes
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 * @param {Readonly<PropsWithChildren>} props - the props for the template; note that children
 * are readonly and required.
 */
export default function Layout({ children }: Readonly<PropsWithChildren>) {
  // render the platform scaffold with full width
  return (
    <PlatformScaffold fullWidth>
      {children}
    </PlatformScaffold>
  );
}
Layout.displayName = "PlatformLayout";
