/**
 * Created At: 2025.09.23:20:11:15
 * @author - @FL03
 * @directory - src/features/orgs/widgets
 * @file - org-form.tsx
 */
"use client";
// imports
import * as React from "react";
import { toast } from "sonner";
// project
import { cn } from "@/lib/utils";
import type { FormProps } from "@/types";
// local
import type { OrganizationData } from "../types";
import { saveOrganizationAction } from "../utils";
// components
import { SubmitButton } from "@/components/common/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const OrganizationForm: React.FC<
  FormProps<
    Partial<OrganizationData>,
    { compact?: boolean; isEditing?: boolean; showLegend?: boolean }
  >
> = (
  {
    className,
    defaultValues,
    values,
    compact,
    isEditing,
    showLegend,
    onCancel,
    onError,
    onSuccess,
  },
) => {
  const [formState, formAction, isPending] = React.useActionState(
    saveOrganizationAction,
    {
      mode: isEditing ? "update" : "create",
    },
  );
  // define the toast ref
  const toastRef = React.useRef<string | number | null>(null);
  // form effects
  React.useEffect(() => {
    if (isPending) {
      toastRef.current ??= toast.loading("Saving organization...", {
        id: "organization-form-toast",
        duration: 3000,
      });
      return;
    }
    if (formState.status === "error") {
      toastRef.current ??= toast.error(`Error: ${formState.error}`, {
        id: "organization-form-toast",
        duration: 5000,
      });
      onError?.(formState.error);
    }
    if (formState.status === "success") {
      toastRef.current ??= toast.success(
        `Organization ${isEditing ? "updated" : "created"} successfully!`,
        { id: "organization-form-toast" },
      );
      onSuccess?.();
    }
    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
        toastRef.current = null;
      }
    };
  }, [formState, isPending, toastRef, onError, onSuccess]);
  // render the component
  return (
    <form
      id="organization-form"
      className={cn("flex flex-1 flex-col px-4 py-2", className)}
      action={formAction}
      onKeyDown={(event) => {
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.currentTarget.requestSubmit();
        }
        if (event.key === "Escape") {
          event.currentTarget.reset();
          onCancel?.();
        }
      }}
    >
      <FieldSet form="organization-form">
        <FieldLegend
          className={cn("text-lg", showLegend ? "not-sr-only" : "sr-only")}
        >
          Organization
        </FieldLegend>
        <FieldDescription
          className={showLegend ? "not-sr-only" : "sr-only"}
        >
          Create a new organization or update an existing one!
        </FieldDescription>
        <FieldGroup>
          {/* name */}
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldDescription className={compact ? "sr-only" : "not-sr-only"}>
                The name of the organization
              </FieldDescription>
              <Input
                autoFocus
                required
                autoCapitalize="words"
                id="name"
                name="name"
                type="text"
                placeholder="Organization Name"
                defaultValue={defaultValues?.name}
                value={values?.name}
              />
            </FieldContent>
          </Field>
          {/* Description */}
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <FieldDescription className={compact ? "sr-only" : "not-sr-only"}>
                An optional description of the organization
              </FieldDescription>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="A brief description of the organization"
                defaultValue={defaultValues?.description}
                value={values?.description}
              />
            </FieldContent>
          </Field>
          {/* Actions */}
          <Field orientation="responsive">
            <SubmitButton
              id="organization-form-submit"
              data-testid="organization-form-submit"
              disabled={isPending}
              className="w-full"
              form="organization-form"
              type="submit"
            />
          </Field>
          {/* Hidden Fields */}
          <Field>
            <Input
              id="organization_id"
              name="id"
              type="hidden"
              defaultValue={defaultValues?.id}
              value={values?.id}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
OrganizationForm.displayName = "OrganizationForm";
