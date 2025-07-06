/**
 * Created At: 2025.07.05:20:09:51
 * @author - @FL03
 * @file - text-editor/editor.tsx
 */
'use client';
// imports
import * as React from 'react';
import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// hooks
import { useTextEditor } from '@/hooks/use-text';
// components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type TextEditorProps = {
  asChild?: boolean;
  className?: string;
};

export const TextEditor: React.FC<TextEditorProps> = ({
  asChild,
  className,
}) => {
  const { data } = useTextEditor();
  // use the `div` element unless `asChild` is true; then use a `Slot` component
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp className={cn('block h-full w-full', className)}>
      <div className="flex flex-nowrap h-1/12 items-center justify-between px-4 gap-4 lg:gap-6">
        {/* leading */}
        <div className="inline-flex flex-nowrap mr-auto items-center gap-2">
          <ToggleGroup variant="outline" type="multiple">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <BoldIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <ItalicIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="strikethrough"
              aria-label="Toggle strikethrough"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {/* primary */}
        <div className="inline-flex flex-nowrap flex-1 items-center gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Font Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">sm</SelectItem>
              <SelectItem value="normal">normal</SelectItem>
              <SelectItem value="lg">large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* trailing */}
        <div className="inline-flex items-center gap-2"></div>
      </div>
      <div>
        <Textarea content={data ?? undefined} />
      </div>
    </Comp>
  );
};
TextEditor.displayName = 'TextEditor';

export default TextEditor;
