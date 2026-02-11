/**
 * Created At: 2025.09.25:13:34:22
 * @author - @FL03
 * @directory - src/features/orgs/widgets
 * @file - org-select.tsx
 */
'use client';
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// local
import { useOrgs } from '@/hooks/use-orgs';
// components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const OrgSelect: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Select>, 'children'> & {
    classNames?: {
      contentClassName?: string;
      triggerClassName?: string;
    };
  }
> = ({ classNames = {}, defaultValue, value, onValueChange, ...props }) => {
  const [selected, setSelected] = React.useState<string | undefined>(
    defaultValue,
  );
  const { data } = useOrgs();

  const onChange = React.useCallback(
    (next: string) => {
      setSelected((prev) => {
        if (prev === next) return prev;
        onValueChange?.(next);
        return next;
      });
    },
    [onValueChange],
  );
  // synchronize external value changes
  React.useEffect(() => {
    if (value && value !== selected) {
      setSelected(value);
    }
  }, [selected, value]);
  // on empty
  if (!data || data.length === 0) {
    return <div>No organizations available</div>;
  }
  return (
    <Select {...props} value={selected} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          'flex-auto w-auto max-w-[200px]',
          classNames?.triggerClassName,
        )}
      >
        <SelectValue placeholder='Select an organization' />
      </SelectTrigger>
      <SelectContent className={classNames?.contentClassName}>
        {data.map(({ id, name }) => (
          <SelectItem
            key={id}
            value={id}
            onSelect={() => {
              if (selected === id) {
                return setSelected(undefined);
              }
              onChange(id);
            }}
          >
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
OrgSelect.displayName = 'OrgSelect';

export default OrgSelect;
