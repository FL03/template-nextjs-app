/**
 * Created At: 2025.10.18:01:51:37
 * @author - @FL03
 * @directory - src/features/platform/widgets
 * @file - platform-settings.tsx
 */
'use client';
// imports
import * as React from 'react';
import { useTheme } from 'next-themes';
// project
import { cn } from '@/lib/utils';
import { FormProps } from '@/types';
// local
import { savePlatformSettings } from '../utils';
// components
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';

type Colorway = {
  name: string;
  value: string;
  color?: string;
};

const COLORWAYS: Colorway[] = [
  { name: 'Blue', value: 'blue' },
  { name: 'Red', value: 'red' },
  { name: 'Green', value: 'green' },
  { name: 'Purple', value: 'purple' },
  { name: 'Orange', value: 'orange' },
  { name: 'Pink', value: 'pink' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Gray', value: 'gray' },
  { name: 'Cyan', value: 'cyan' },
  { name: 'Teal', value: 'teal' },
];

type SystemFormData = {};

/** The `SystemSettingsForm` component is a pre-designed form for managing various platform-related settings and customizations. */
export const SystemSettingsForm: React.FC<FormProps<SystemFormData>> = ({
  ref,
  className,
  defaultValues,
  values,
  onError,
  onSuccess,
  ...props
}) => {
  const [formState, formAction] = React.useActionState(
    savePlatformSettings,
    {},
  );
  // call the useTheme hook to get the current theme and a setter for it
  const { theme, setTheme } = useTheme();
  return (
    <form
      {...props}
      ref={ref}
      id='platform-settings-form'
      action={formAction}
      className={cn(
        'flex flex-1 flex-col h-full w-full relative z-auto',
        className,
      )}
    >
      <FieldSet form='platform-settings-form'>
        <FieldLegend>System</FieldLegend>
        <FieldDescription>
          COnfigure various platform settings.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldContent>
              <FieldLabel>Colorway</FieldLabel>

              <FieldDescription>
                Select the colorway you want to use.
              </FieldDescription>
            </FieldContent>

            <Select
            // onValueChange={(value) => field.onChange(value)}
            // value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder='Choose your colorway' />
              </SelectTrigger>
              <SelectContent defaultValue='default'>
                <SelectItem value='default'>Default</SelectItem>
                <SelectItem value='light'>Light</SelectItem>
                {COLORWAYS.map(({ name, value }, index) => (
                  <SelectItem key={index} value={value}>
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg bg-linear-to-br from-100% to-25% bg-blend-color',
                        `bg-${value}-500`,
                      )}
                    />
                    <span>{name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldContent>
              <FieldLabel>Theme</FieldLabel>
              <FieldDescription>
                Select the theme you want to use.
              </FieldDescription>
            </FieldContent>
            <Select onValueChange={(value) => setTheme(value)} value={theme}>
              <SelectTrigger>
                <SelectValue placeholder='Choose your preffered theme' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='system'>System</SelectItem>
                <SelectItem value='dark'>Dark</SelectItem>
                <SelectItem value='light'>Light</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {/* Actions */}
          <Field orientation='horizontal'>
            <Button form='platform-settings-form' type='submit'>
              Save
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default SystemSettingsForm;
