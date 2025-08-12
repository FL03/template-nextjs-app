/**
 * Created At: 2025.07.17:10:35:49
 * @author - @FL03
 * @file - auth/layout.tsx
 */

/**
 * The base layout for the authentication pages; i.e. login, register, forgot password, etc.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 * @param {Readonly<PropsWithChildren>} props - the props for the template; note that children
 * are readonly and required.
 */
export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <div className="relative flex flex-1 flex-col min-h-svh w-full">
      {children}
    </div>
  );
}
Layout.displayName = "AuthLayout";
