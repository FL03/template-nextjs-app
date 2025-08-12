/**
 * Created At: 2025.07.13:08:53:14
 * @author - @FL03
 * @file - title-editor.tsx
 */
"use client";
// imports
import * as React from "react";
import { Edit3Icon, SaveIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
// project
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
// components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TitleEditorClasses = {
  inputClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
};

interface TitleEditorProps {
  className?: string;
  classNames?: TitleEditorClasses;
  defaultValue?: string;
  value?: string;
  fieldLabel?: React.ReactNode;
  disabled?: boolean;
  readonly?: boolean;
  onValueChange?: (value: string) => void;
  onValueSave?: (value: string) => void;
}

/**
 * This widget is used to display and edit the title of a document. By clicking the _edit_ button, the user can trigger a switch to an _editable_ state in-which
 * they can update or set the title of their document.
 */
export const TitleEditor: React.FC<TitleEditorProps> = ({
  className,
  classNames,
  disabled,
  readonly,
  value,
  defaultValue = "Untitled",
  fieldLabel = "Title",
  onValueChange,
  onValueSave,
}) => {
  // setup the state for the editable value
  const [title, setTitle] = React.useState<string>(defaultValue);
  // define various signals for the component
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  // a callback for handling changes to the title input
  const handleOnChange = (data: string) => {
    // update the title state
    setTitle(data);
    // if the `onChange` prop is provided, call it with the new value
    if (onValueChange) onValueChange(data);
  };
  // a callback fr handling the cancel action
  const handleOnCancel = () => {
    // reset the data to its original value
    setTitle(defaultValue);
    // exit editing mode
    setIsEditing(false);
  };
  // a callback for handling the save action
  const handleOnSave = () => {
    // handle the save action with a toast notification
    toast.promise(
      async () => {
        try {
          //
          if (onValueSave) onValueSave(title);
        } catch (error) {
          logger.error(
            { data: title, error },
            `An error occurred while saving the ${fieldLabel}`,
          );
        } finally {
          setIsEditing(false);
          setIsSaving(false);
        }
      },
      {
        error: `An error occurred while saving the ${fieldLabel}`,
        loading: `Saving ${fieldLabel}...`,
        success: `${fieldLabel} updated successfully`,
      },
    );
  };
  // synchronize the local state with the controlled value prop
  React.useEffect(() => {
    if (value !== undefined && value !== title) {
      handleOnChange(value);
    }
  }, [value]);
  // setup the save action
  React.useEffect(() => {
    if (isSaving) {
      handleOnSave();
    }
    return () => {
      // cleanup the saving state on unmount
      setIsSaving(false);
    };
  }, [isSaving, handleOnSave]);

  // render the display
  const _Editor = () => {
    return (
      <>
        <Input
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          disabled={readonly}
          readOnly={readonly}
          maxLength={100}
          type="text"
          placeholder={defaultValue}
          value={title}
          className={cn(
            "w-full max-w-sm",
            classNames?.inputClassName,
          )}
          onChange={(event) => {
            // prevent the default action
            event.preventDefault();
            // stop the event from bubbling up to parent elements
            event.stopPropagation();
            // update the data state with the new value
            handleOnChange(event.target.value);
          }}
          onKeyDown={(event) => {
            // handle the Enter key to save changes
            if (
              event.key === "Enter" || (event.key === "Enter" && event.shiftKey)
            ) {
              setIsSaving(true);
            }
            // handle the Escape key to cancel editing
            if (event.key === "Escape") {
              handleOnCancel();
            }
          }}
        />
        <div className="inline-flex flex-nowrap gap-2 items-center">
          <Button
            size="icon"
            variant="outline"
            disabled={readonly || isSaving}
            onClick={(event: React.BaseSyntheticEvent) => {
              // prevent the default action
              event.preventDefault();
              // stop the event from bubbling up to parent elements
              event.stopPropagation();
              // trigger the save action
              setIsSaving(true);
            }}
          >
            <SaveIcon className="h-4 w-4" />
            <span className="sr-only">Save</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={readonly}
            onClick={(event: React.BaseSyntheticEvent) => {
              // prevent the default action
              event.preventDefault();
              // stop the event from bubbling up to parent elements
              event.stopPropagation();
              // handle the cancel action
              handleOnCancel();
            }}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>
      </>
    );
  };
  // render the display whenever the component is not in editing mode
  const _Display = () => {
    // render the display with the current title value
    return (
      <>
        <div
          className="leading-none trailing-tight"
          onDoubleClick={(event) => {
            // prevent the default action
            event.preventDefault();
            // prevent the event from bubbling up to parent elements
            event.stopPropagation();
            // Only allow editing if not readonly and not already editing
            if (!readonly && !isEditing) setIsEditing(true);
          }}
        >
          {title}
        </div>
        <Button
          size="icon"
          variant="ghost"
          disabled={disabled || readonly}
          onClick={() => setIsEditing(true)}
        >
          <Edit3Icon className="h-4 w-4" />
        </Button>
      </>
    );
  };

  // render the component
  return (
    <div
      className={cn(
        "flex flex-nowrap items-center justify-start gap-2 w-full",
        className,
      )}
    >
      {fieldLabel && (
        <Label
          className={cn(
            "font-semibold tracking-tight leading-none",
            classNames?.labelClassName,
          )}
        >
          {fieldLabel}
        </Label>
      )}
      <div className="inline-flex flex-nowrap gap-2 items-center">
        {isEditing ? <_Editor /> : <_Display />}
      </div>
    </div>
  );
};
TitleEditor.displayName = "TitleEditor";

export default TitleEditor;
