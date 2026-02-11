/**
 * Created At: 2025.05.12:23:20:32
 * @author - @FL03
 * @file - loading.tsx
 */
// imports
import { cn } from '@/lib/utils';
import { LoadingIndicator } from '@/components/common/loading';

/**
 * The `Loading` page for the platform.
 *  *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#loading
 */
export default function Loading() {
  return (
    <div
      className={cn(
        'relative z-99 flex flex-1 items-center justify-center h-screen w-full',
        'backdrop-blur-2xl bg-background/50 text-foreground',
      )}
    >
      <LoadingIndicator
        showLabel
        classNames={{
          iconClassName: 'size-10 text-primary',
          labelClassName: 'text-2xl font-bold text-primary',
        }}
      />
    </div>
  );
}
Loading.displayName = 'LoadingPage';
