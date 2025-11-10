/**
 * Created At: 2025.10.10:10:11:31
 * @author - @FL03
 * @directory - src/app/pricing
 * @file - layout.tsx
 */

export default function Layout(
  { children }: Readonly<React.PropsWithChildren>,
) {
  return (
    <div className="flex-1 h-screen w-full">
      {children}
    </div>
  );
}
Layout.displayName = "PricingLayout";
