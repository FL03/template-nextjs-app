/**
 * Created At: 2025.07.17:11:16:10
 * @author - @FL03
 * @file - profile-form.tsx
 */
"use client";
// imports
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slot } from "@radix-ui/react-slot";
// project
import { logger } from "@/lib/logger";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// feature-specific
import * as actions from "../utils";

const profileSchema = z
  .object({
    id: z.uuid({ error: "An ID is required " }).readonly(),
    username: z.string({ error: "Username is required" }).min(3).max(30),
    display_name: z.string().default("").nullish(),
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
    middle_name: z.string().nullish(),
    name_prefix: z.string().nullish(),
    name_suffix: z.string().nullish(),
    avatar_url: z.url().nullish(),
    bio: z.string().nullish(),
    role: z.string().default("user").nullish(),
    emails: z.string().array().default([]).nullish(),
    socials: z.string().array().default([]).nullish(),
    website: z.url().default("").nullish(),
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;

const parseValues = (profile: any) => {
  if (!profile.id) {
    throw new Error("Profile ID is required");
  }
  return profileSchema.parse({
    id: profile.id,
    username: profile.username,
    display_name: profile.display_name,
    first_name: profile.first_name,
    last_name: profile.last_name,
    middle_name: profile.middle_name,
    name_prefix: profile.name_prefix,
    name_suffix: profile.name_suffix,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    role: profile.role ?? "user",
    socials: profile.socials,
  });
};

type ProfileFormSchema = z.infer<typeof profileSchema>;

type FormProps = {
  defaultValues?: Partial<ProfileFormSchema>;
  values?: ProfileFormSchema;
  asChild?: boolean;
};

export const ProfileForm: React.FC<
  Omit<React.ComponentPropsWithRef<"form">, "children" | "onSubmit"> & FormProps
> = ({ ref, className, defaultValues, values, asChild, ...props }) => {
  // render the component as a slot if asChild is true
  const Comp = asChild ? Slot : "form";
  // setup providers
  const router = useRouter();
  // handle values args
  if (defaultValues && values) {
    logger.warn(
      "Cannot provide both `defaultValues` and `values`; merging them into the defaultValues...",
    );
    defaultValues = { ...defaultValues, ...values };
  }
  // if any default values are provided, parse them
  defaultValues &&= parseValues(defaultValues);
  // if any values are provided, parse them
  values &&= parseValues(values);
  // define the form with the useForm hook
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onSubmit",
    defaultValues,
    values,
  });
  // a callback for handling form submission(s)
  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    // prevent the default form submission behavior
    event.preventDefault();
    // prevent the submission if the for is in an invalid state
    if (!form.formState.isValid) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }
    // get the form values
    const formValues = form.getValues();
    // handle the form submission
    toast.promise(
      // use the form action to upsert the profile
      actions.upsertProfile(formValues).catch((error) => {
        logger.error(error, "Failed to upsert the user profile");
      }),
      {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: "Failed to update profile",
      },
    );
    // reset the form
    form.reset();
    // refresh the router to reflect the changes
    router.refresh();
  };
  // render the component
  return (
    <Form {...form}>
      <Comp
        ref={ref}
        className={cn("relative flex flex-col flex-1 w-full gap-2", className)}
        onSubmit={handleFormSubmit}
        {...props}
      >
        {/* Display Name */}
        <FormField
          control={form.control}
          name="display_name"
          render={({ field: { value, ...field } }) => (
            <FormItem itemType="text" datatype="text">
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Display Name"
                  type="text"
                  value={value ?? ""}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is how your name will appear in the app.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* first name */}
        <FormField
          control={form.control}
          name="first_name"
          render={({ field: { value, ...field } }) => (
            <FormItem itemType="text" datatype="text">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="First Name"
                  type="text"
                  value={value ?? ""}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* last name */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field: { value, ...field } }) => (
            <FormItem itemType="text" datatype="text">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Last Name"
                  type="text"
                  value={value ?? ""}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem itemType="text" datatype="text">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" type="text" {...field} />
              </FormControl>
              <FormDescription>
                Your choosen username will be visible for all users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field: { value, ...field } }) => (
            <FormItem itemType="text" datatype="text">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Bio" value={value ?? ""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4 flex flex-row flex-nowrap items-center justify-center justify-items-center gap-2 lg:gap-4">
          <Button type="submit">Save</Button>
        </div>
      </Comp>
    </Form>
  );
};

export default ProfileForm;
