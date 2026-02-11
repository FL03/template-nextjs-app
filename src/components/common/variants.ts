/**
 * Created At: 2025.10.22:17:22:27
 * @author - @FL03
 * @directory - src/components/common/variants
 * @file - flavors.ts
 */
import { cva, VariantProps } from 'class-variance-authority';

// flavor variants
export const flavorVariants = cva('', {
  defaultVariants: {
    flavor: 'default',
  },
  variants: {
    flavor: {
      default: 'bg-transparent text-foreground border-border',
      accent: 'bg-accent text-accent-foreground border-accent/15',
      primary: 'bg-primary text-primary-foreground border-primary/15',
      secondary: 'bg-secondary text-secondary-foreground border-secondary/15',
      card: 'bg-card text-card-foreground border-border',
      destructive: [
        'bg-destructive text-destructive-foreground border-destructive',
      ],
      muted: 'bg-muted text-muted-foreground border-muted',
      surface: 'bg-surface text-surface-foreground border-surface',
    },
  },
});

export type FlavorVariantProps = VariantProps<typeof flavorVariants>;

// text variants
export const textVariants = cva(
  'font-sans font-normal leading-relaxed text-gray-900 dark:text-gray-100',
  {
    defaultVariants: {
      size: 'base',
      weight: 'normal',
    },
    variants: {
      size: {
        base: 'text-base',
        xs: 'text-xs',
        sm: 'text-sm',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
        '7xl': 'text-7xl',
        '8xl': 'text-8xl',
        '9xl': 'text-9xl',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
        black: 'font-black',
      },
    },
  },
);

export type TextVariantProps = VariantProps<typeof textVariants>;
