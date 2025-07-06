// toolbar-variants.tsx
import { cva, type VariantProps } from 'class-variance-authority';

export const toolbarVariants = cva(
  'w-full flex flex-row flex-nowrap gap-2 lg:gap-4 items-center mt-4 px-4 py-2 transform inset-1',
  {
    variants: {
      variant: {
        default: 'sticky top-0',
        top: 'sticky top-0 mt-4',
        topCenter: 'sticky top-0 container mx-auto mt-4',
        bottom: 'sticky bottom-0',
        bottomCenter: 'sticky bottom-0 container mx-auto rounded-full -translate-y-1/4 max-w-[90%]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/** A type alias for the variants of the `Toolbar` component */
export type ToolbarVariants = VariantProps<typeof toolbarVariants>;