// link-button.tsx
import * as React from 'react';
import Link from 'next/link';
// components
import { Button } from '@/components/ui/button';


export const LinkButton: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof Button>,
    'asChild' | 'children' | 'title' | 'onClick'
  > &
    React.PropsWithChildren<{
      icon?: React.ReactNode;
      label?: React.ReactNode;
      href: React.ComponentPropsWithRef<typeof Link>['href'];
    }>
> = ({
  ref,
  children,
  className,
  href,
  icon,
  label,
  size = 'sm',
  variant = 'link',
  ...props
}) => {
  return (
    <Button {...props} asChild ref={ref} size={size} variant={variant}>
      <Link href={href}>
        {icon && <div className="leading-none">{icon}</div>}
        {label && <span>{label}</span>}
      </Link>
    </Button>
  );
};
LinkButton.displayName = 'LinkButton';

export default LinkButton;