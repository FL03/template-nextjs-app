/**
 * Created At: 2025.05.16:12:23:35
 * @author - @FL03
 * @file - (auth)/template.tsx
 */
"use server";
// imports
import { PropsWithChildren } from "react";

/**
 * A custom template for authenticated routes.
 *
 * ## Behaviors
 *
 * - **Server Components**: By default, templates are Server Components.
 * - **Remount on navigation**: Templates receive a unique key automatically. Navigating to a new route causes the template and its children to remount.
 * - **State reset**: Any Client Component inside the template will reset its state on navigation.
 * - **Effect re-run**: Effects like useEffect will re-synchronize as the component remounts.
 *  - **DOM reset**: DOM elements inside the template are fully recreated.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/template
 * @param {Readonly<PropsWithChildren>} props - the props for the template contains a read-only reference to the children, which are required.
 */
export default async function Template(
  { children }: Readonly<PropsWithChildren>,
) {
  return children;
}
Template.displayName = "PlatformTemplate";
