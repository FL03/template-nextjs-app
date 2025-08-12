/**
 * Created At: 2025.07.06:20:40:22
 * @author - @FL03
 * @file - font.tsx
 */
"use client";
// imports
import * as React from "react";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
// components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ToggleGroupValue = "bold" | "italic" | "strikethrough";

export const TextFormatGroup: React.FC<{
  title?: string;
  variant?: React.ComponentProps<typeof ToggleGroup>["variant"];
  iconHeight?: number;
  iconWidth?: number;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}> = ({
  iconHeight = 6,
  iconWidth = 6,
  title = "FormatOptions",
  variant = "outline",
  defaultValue = [],
  value,
  onValueChange,
}) => {
  const [checked, setChecked] = React.useState<string[]>(
    value || defaultValue,
  );
  // a callback for handling changes to the text format
  const handleValueChange = (next: ToggleGroupValue[]) => {
    // update the text format state
    setChecked(next);
    // if the `onValueChange` prop is provided, call it with the new value
    if (onValueChange) onValueChange(next);
  };
  return (
    <ToggleGroup
      type="multiple"
      onValueChange={handleValueChange}
      value={checked}
      title={title}
      variant={variant}
    >
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <BoldIcon className={`h-${iconHeight} w-${iconWidth}`} />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <ItalicIcon className={`h-${iconHeight} w-${iconWidth}`} />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <UnderlineIcon className={`h-${iconHeight} w-${iconWidth}`} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
TextFormatGroup.displayName = "TextFormatGroup";

/** This component is a simple selection utility for managing the font size of the current line */
export const FontSizeSelect: React.FC<
  Omit<React.ComponentProps<typeof Select>, "children">
> = ({ defaultValue = "11", value, onValueChange, ...props }) => {
  const sizes = Array.from({ length: 24 }, (_, i) => i + 1); // Generate font sizes from 1 to 24
  // render the font size select component
  return (
    <Select
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      {...props}
    >
      <SelectTrigger className="w-20">
        <SelectValue placeholder="Font Size" />
      </SelectTrigger>
      <SelectContent>
        {sizes.map((v, index) => (
          <SelectItem key={index} value={String(v)}>
            {v}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
FontSizeSelect.displayName = "FontSizeSelect";

export const FontStyleSelect: React.FC<
  Omit<React.ComponentProps<typeof Select>, "children">
> = ({ defaultValue = "Normal", value, onValueChange, ...props }) => {
  const headings = Array.from({ length: 6 }, (_, i) => i + 1).map(
    (i) => `Heading ${i}`,
  );
  const styles = ["Normal", "Quote", "Code", ...headings];
  // render the font style select component
  return (
    <Select
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      {...props}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Font Style" />
      </SelectTrigger>
      <SelectContent>
        {styles.map((v, index) => (
          <SelectItem key={index} value={String(v)}>
            {v}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
