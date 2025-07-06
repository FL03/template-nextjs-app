/**
 * Created At: 2025.07.05:23:34:28
 * @author - @FL03
 * @file - appbar-variants.tsx
 */
import { cva, type VariantProps } from 'class-variance-authority';

/** Create a new `AppBar` component variant props instance.
 * 
 * @returns {AppBarVariants} - The variant props for the `AppBar` component.
 */
export const appBarVariants = cva(
  'flex flex-row flex-nowrap items-center w-full',
  {
    defaultVariants: {
      flavor: 'default',
      position: 'default',
      variant: 'default',
    },
    variants: {
      flavor: {
        default: 'bg-background text-foreground',
        inherit: 'bg-inherit text-inherit',
        accent: 'bg-accent text-accent-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        transparent: 'bg-transparent text-foreground',
      },
      position: {
        default: 'sticky top-0',
        stickyBottom: 'sticky bottom-0',
      },
      variant: {
        default: '',
        rounded: 'rounded-full mx-auto ',
      },
    },
  }
);

/** A type alias for the variant props of the `AppBar` component. */
export type AppBarVariants = VariantProps<typeof appBarVariants>;
