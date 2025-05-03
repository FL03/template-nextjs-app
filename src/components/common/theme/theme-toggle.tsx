/*
  Appellation: theme-button <common>
  Contrib: FL03 <jo3mccain@icloud.com>
*/
'use client';

import * as React from 'react';
// imports
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
// project
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const ThemeButton: React.FC<
  React.ComponentProps<typeof Button> & {
    lightIcon?: React.ReactNode;
    darkIcon?: React.ReactNode;
  }
> = ({
  className,
  size = 'icon',
  variant = 'ghost',
  darkIcon = <Moon />,
  lightIcon = <Sun />,
  ...props
}) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const isDark = () => resolvedTheme === 'dark';

  const icon = (mode?: string) =>
    mode === 'system' || mode === 'dark' ? darkIcon : lightIcon;

  function onClick() {
    setTheme(isDark() ? 'light' : 'dark');
  }

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted, setMounted]);

  if (!mounted || !resolvedTheme) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn('relative w-full', className)}
            onClick={onClick}
            size={size}
            variant={variant}
            {...props}
          >
            {icon(resolvedTheme)}
            <span className="sr-only">Theme mode toggle</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle the theme mode ({resolvedTheme})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
ThemeButton.displayName = 'ThemeButton';

export default ThemeButton;
