/**
 * Created At: 2025.07.05:08:23:57
 * @author - @FL03
 * @file - (public)/layout.tsx
 */
// imports
import { PlatformScaffold } from "@/features/platform";

/**
 * The layout for all _public_ routes; i.e. routes that do not require authentication.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 * @param {Readonly<PropsWithChildren>} props - the props for the layout; note that children
 * are readonly and required.
 */
export default function Layout(
  { children }: Readonly<React.PropsWithChildren>,
) {
  return (
    <PlatformScaffold compact>
      {children}
    </PlatformScaffold>
  );
}
Layout.displayName = "PublicLayout";
