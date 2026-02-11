/**
 * Created At: 2025.09.30:14:01:17
 * @author - @FL03
 * @directory - src/features/orgs/widgets
 * @file - org-input.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
// project
import { useModal } from '@/hooks/use-modal';
import { useOrgs } from '@/hooks/use-orgs';
import { cn } from '@/lib/utils';
// local
import { OrganizationData } from '../types';
// components
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

/** The `OrgCombo` widget renders a combination box allowing one to filter by a selected value. */
export const OrgCombo: React.FC<{
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  defaultValue?: OrganizationData;
  value?: OrganizationData;
  onValueChange?(value: OrganizationData | null): void;
}> = ({
  defaultOpen,
  defaultValue,
  open,
  value,
  onOpenChange,
  onValueChange,
}) => {
  const modal = useModal({ defaultOpen, open, onOpenChange });
  const { data } = useOrgs();

  const [selected, setSelected] = React.useState<OrganizationData | null>(
    defaultValue ?? null,
  );

  const handleOnValueChange = React.useCallback(
    (nxt: OrganizationData | null) =>
      setSelected((prev) => {
        if (prev === nxt) return prev;
        if (onValueChange) onValueChange(nxt);
        return nxt;
      }),
    [onValueChange],
  );

  React.useEffect(() => {
    if (value && value !== selected) {
      setSelected(value);
    }
  }, [value, selected]);

  return (
    <Popover open={modal.isOpen} onOpenChange={modal.setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[150px] md:w-[200px] justify-between'
        >
          <span>{selected?.name ?? 'Organization'}</span>
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Command>
          <CommandInput placeholder='Search organizations...' className='h-9' />
          <CommandList>
            <CommandEmpty>No organization(s) found...</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={(cv) => {
                    handleOnValueChange(selected?.name === cv ? null : item);
                    modal.close();
                  }}
                >
                  {item.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      selected?.name === item.name
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
