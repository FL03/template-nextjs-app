/**
 * Created At: 2025.07.06:07:00:06
 * @author - @FL03
 * @file - scaffold-variants.tsx
 */
import { cva, VariantProps } from 'class-variance-authority';

/** Define and initialize the `Scaffold` variants using the `cva` method from the `class-variance-authority` package.
 *
 */
export const scaffoldVariants = cva(
  'relative flex flex-col flex-1 h-full w-full overflow-auto',
  {
    defaultVariants: {
      flavor: 'default',
      variant: 'default',
    },
    variants: {
      flavor: {
        default: 'bg-background text-foreground',
        accent: 'bg-accent text-accent-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
      },
      variant: {
        default: '',
        rounded:
          'rounded-2xl border-none ring-none shadow-inner drop-shadow-xl',
      },
    },
  }
);

/** A type alias for the variants of a `Scaffold` component. */
export type ScaffoldVariants = VariantProps<typeof scaffoldVariants>;
