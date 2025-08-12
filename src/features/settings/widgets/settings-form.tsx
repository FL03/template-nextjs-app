/*
  Appellation: settings_form <module>
  Contrib: @FL03
*/
"use client";
// imports
import * as React from "react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// project
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// feature-specific
import * as actions from "../utils";

// define the schema for the form
const settingsForm = z.object({
  colorway: z.string({
    error: "Please select a valid colorway for the platform.",
  }).default("default").optional(),
  theme: z.string({
    error: "Please select one of the available themes for the platform.",
  }).default("system").optional(),
});
/** The _**type**_ of schema used to define the system settings form.  */
type SystemFormData = z.infer<typeof settingsForm>;

type Colorway = {
  name: string;
  value: string;
  color?: string;
};

const COLORWAYS: Colorway[] = [
  { name: "Blue", value: "blue" },
  { name: "Red", value: "red" },
  { name: "Green", value: "green" },
  { name: "Purple", value: "purple" },
  { name: "Orange", value: "orange" },
  { name: "Pink", value: "pink" },
  { name: "Yellow", value: "yellow" },
  { name: "Gray", value: "gray" },
  { name: "Cyan", value: "cyan" },
  { name: "Teal", value: "teal" },
];

type FormPropsT = {
  defaultValues?: Partial<SystemFormData>;
  values?: SystemFormData;
  onSubmit?: (data: SystemFormData) => void;
  onError?: (error: Error) => void;
  onSuccess?: (data: SystemFormData) => void;
  onReset?: () => void;
};
/** The `SystemSettingsForm` component is a pre-designed form for managing various platform-related settings and customizations. */
export const SystemSettingsForm: React.FC<
  & Omit<React.ComponentPropsWithRef<"form">, "children" | "onSubmit">
  & FormPropsT
> = ({
  ref,
  className,
  defaultValues,
  values,
  onSubmit = actions.handleSubmitSettings,
  ...props
}) => {
  // call the useTheme hook to get the current theme and a setter for it
  const { theme, setTheme } = useTheme();
  // 1. Define the form
  const form = useForm<SystemFormData>({
    resolver: zodResolver(settingsForm),
    defaultValues,
    values,
  });

  const handleOnSubmit: React.FormEventHandler = async (event) => {
    // prevent the default form submission
    event.preventDefault();
    // stop the event from bubbling up
    event.stopPropagation();
    // destructure the form state to ensure the forms validity
    const { isValid } = form.formState;
    // handle the case where the form is not valid
    if (!isValid) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }
    // try to submit the form
    try {
      // get the form values
      const values = form.getValues();
      // if no onSubmit handler is provided, use the default action
      onSubmit(values);
      // notify the user of success
      toast.success("Settings saved successfully");
    } catch (err) {
      // notify the user of an error
      toast.error("An error occurred while saving your settings");
    }
  };

  return (
    <Form {...form}>
      <form
        {...props}
        ref={ref}
        className={cn("w-full flex flex-col gap-2 lg:gap-4", className)}
        onSubmit={handleOnSubmit}
      >
        <FormField
          control={form.control}
          name="colorway"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colorway</FormLabel>
              <FormControl {...field}>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your colorway" />
                  </SelectTrigger>
                  <SelectContent defaultValue="default">
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    {COLORWAYS.map(({ name, value }, index) => (
                      <SelectItem key={index} value={value}>
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg bg-gradient-to-br from-100% to-25% bg-blend-color",
                            `bg-${value}-500`,
                          )}
                        />
                        <span>{name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the colorway you want to use.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme Mode</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => setTheme(value)}
                  value={theme}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your preffered theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the theme mode you want to use.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="bottom-0 flex flex-1 flex-nowrap items-center gap-2 ">
          <div className="inline-flex items-center justify-end gap-2 ml-auto right-0">
            <Button type="submit">Save</Button>
          </div>
        </section>
      </form>
    </Form>
  );
};

export default SystemSettingsForm;
