/*
  Appellation: theme_selector <module>
  Contrib: @FL03
*/
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ThemeSelector
export const ThemeSelector: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Select>, "children"> & {
    className?: string;
  }
> = ({ className, onValueChange, ...props }) => {
  // get a reference to the current theme
  const { theme, setTheme } = useTheme();
  // a map defining the available themes
  const themes = {
    system: "System",
    dark: "Dark",
    light: "Light",
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
    <Select
      onValueChange={handleValueChange}
      value={theme}
      {...props}
    >
      <SelectTrigger
        className={cn(
          "w-[180px]",
          className,
        )}
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Themes</SelectLabel>
          {Object.entries(themes).map(([value, label], index) => (
            <SelectItem
              key={index}
              value={value}
            >
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
ThemeSelector.displayName = "ThemeSelector";

export default ThemeSelector;
