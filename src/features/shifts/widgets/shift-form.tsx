/**
 * Created At: 2025.09.11:18:43:40
 * @author - @FL03
 * @file - shift-form.tsx
 */
"use client";
// imports
import * as React from "react";
import { toast } from "sonner";
// project
import { useCurrentUser } from "@/features/auth";
import { OrgSelect } from "@/features/orgs";
import { cn } from "@/lib/utils";
import { FormProps } from "@/types";
// local
import { ShiftData } from "../types";
import { saveShiftAction } from "../utils";
// components
import { SaveButton } from "@/components/common/button";
import { DateField } from "@/components/common/fields";
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

export const ShiftForm: React.FC<
  FormProps<Partial<ShiftData>, {
    redirectOnSuccess?: string;
    isEditing?: boolean;
    showLegend?: boolean;
    hideDescriptions?: boolean;
  }>
> = ({
  ref,
  className,
  defaultValues,
  values,
  isEditing,
  showLegend,
  hideDescriptions,
  onCancel,
  onError,
  onSuccess,
  ...props
}) => {
  // hooks
  const { profile, username } = useCurrentUser();
  // setup the form action
  const [_, formAction, isPending] = React.useActionState(
    saveShiftAction,
    {
      mode: isEditing ? "update" : "create",
    },
  );
  // ensure the default assignee is set to the current user if not provided
  defaultValues = {
    assignee: username ?? undefined,
    organization_id: profile?.primary_organization ?? undefined,
    date: new Date().toISOString(),
    ...defaultValues,
  };
  const toastRef = React.useRef<string | number | undefined>(undefined);
  React.useEffect(() => {
    if (isPending) {
      toastRef.current ??= toast.loading(
        "Saving the shift...",
        {
          id: "shift-form-action",
        },
      );
    }
    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
        toastRef.current = undefined;
      }
    };
  }, [toastRef, isPending]);
  return (
    <form
      {...props}
      ref={ref}
      id="shift-form"
      className={cn(
        "flex flex-col flex-1 w-full relative z-auto",
        className,
      )}
      action={formAction}
      onKeyDown={(event) => {
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          event.currentTarget.requestSubmit();
        }
        if (event.key === "Escape") {
          event.currentTarget.reset();
          onCancel?.();
        }
      }}
    >
      <FieldSet form="shift-form">
        <FieldLegend
          className={cn("text-xl", showLegend ? "not-sr-only" : "sr-only")}
        >
          Shift
        </FieldLegend>
        <FieldDescription
          className={cn("text-sm", showLegend ? "not-sr-only" : "sr-only")}
        >
          Use this form to {isEditing ? "edit" : "create"} a shift.
        </FieldDescription>
        <FieldGroup className="flex-1 h-full w-full p-2 relative z-auto">
          {/* Date */}
          <DateField
            showFooter
            name="date"
            defaultValue={defaultValues?.date}
            value={values?.date}
          />
          {/* Organization Id */}
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel>
                Organization
              </FieldLabel>
              <FieldDescription
                className={hideDescriptions ? "sr-only" : "not-sr-only"}
              >
                Associate the shift with an organization.
              </FieldDescription>
            </FieldContent>
            <OrgSelect
              name="organization_id"
              defaultValue={defaultValues?.organization_id ?? undefined}
              value={values?.organization_id ?? undefined}
            />
          </Field>
          {/* Cash Tips */}
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="tips_cash">
                Cash
              </FieldLabel>
              <FieldDescription
                className={hideDescriptions ? "sr-only" : "not-sr-only"}
              >
                Record the total amount of cash tips earned during the shift.
              </FieldDescription>
            </FieldContent>
            <Input
              id="tips_cash"
              name="tips_cash"
              type="number"
              placeholder="Cash tips"
              defaultValue={defaultValues?.tips_cash ?? 0}
              value={values?.tips_cash}
            />
          </Field>
          {/* Credit Tips */}
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="tips_credit">
                Credit
              </FieldLabel>
              <FieldDescription
                className={hideDescriptions ? "sr-only" : "not-sr-only"}
              >
                Record the total amount of credit tips earned during the shift.
              </FieldDescription>
            </FieldContent>
            <Input
              id="tips_credit"
              name="tips_credit"
              type="number"
              placeholder="Credit tips"
              defaultValue={defaultValues?.tips_credit ?? 0}
              value={values?.tips_credit}
            />
          </Field>
          {/* Hidden */}
          <Field>
            <Input
              name="id"
              type="hidden"
              defaultValue={defaultValues?.id}
              value={values?.id}
            />
          </Field>
          <Field>
            <Input
              name="assignee"
              type="hidden"
              defaultValue={defaultValues?.assignee}
              value={values?.assignee}
            />
          </Field>
          {/* Actions */}
          <Field orientation="responsive">
            <SaveButton
              id="shift-form-submit"
              data-testid="shift-form-submit"
              className="w-full"
              form="shift-form"
              type="submit"
              isSaving={isPending}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
ShiftForm.displayName = "ShiftForm";
