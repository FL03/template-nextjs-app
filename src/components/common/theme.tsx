/**
 * Created At: 2025.10.29:22:30:05
 * @author - @FL03
 * @directory - src/components/common
 * @file - theme.tsx
 */
'use client';
// imports
import * as React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ClassNames } from '@pzzld/core';
// project
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const ThemeButton: React.FC<
  React.ComponentProps<typeof Button> & {
    showLabel?: boolean;
    classNames?: ClassNames<'icon' | 'label'>;
  }
> = ({
  ref,
  className,
  classNames,
  size = 'icon',
  variant = 'ghost',
  showLabel,
  ...props
}) => {
  const { setTheme, resolvedTheme } = useTheme();
  // returns true if dark mode is enabled
  const isDark = React.useMemo(() => resolvedTheme === 'dark', [resolvedTheme]);
  // resolves the icon based on the current theme
  const Icon = ({ darkMode }: { darkMode?: boolean }) => {
    if (darkMode) {
      return <MoonIcon className={cn('size-4', classNames?.iconClassName)} />;
    }
    return <SunIcon className={cn('size-4', classNames?.iconClassName)} />;
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            ref={ref}
            className={cn('relative w-full', className)}
            size={size}
            variant={variant}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              // toggle the theme between light and dark
              setTheme(isDark ? 'light' : 'dark');
            }}
          >
            <Icon darkMode={isDark} />
            <span
              className={size?.startsWith('icon') ? 'sr-only' : 'not-sr-only'}
            >
              Theme
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle the theme mode ({resolvedTheme})</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
ThemeButton.displayName = 'ThemeButton';

// ThemeSelector
export const ThemeSelector: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Select>, 'children'> & {
    className?: string;
  }
> = ({ className, onValueChange, ...props }) => {
  // get a reference to the current theme
  const { theme, setTheme } = useTheme();
  // a map defining the available themes
  const themes = {
    system: 'System',
    dark: 'Dark',
    light: 'Light',
  };
  // handle any changes to the selected value
  const handleValueChange = (value: string) => {
    // set the theme based on the value selected
    setTheme(value);
    // if provided, invoke the onValueChange callback
    if (onValueChange) {
      onValueChange(value);
    }
  };
  // render the component
  return (
    <Select onValueChange={handleValueChange} value={theme} {...props}>
      <SelectTrigger className={cn('w-[180px]', className)}>
        <SelectValue placeholder='Theme' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Themes</SelectLabel>
          {Object.entries(themes).map(([value, label], index) => (
            <SelectItem key={index} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
ThemeSelector.displayName = 'ThemeSelector';
