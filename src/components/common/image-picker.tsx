// image-picker.tsx
"use client";
// imports
import * as React from "react";
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ImagePicker: React.FC<
  Omit<
    React.ComponentPropsWithRef<"div">,
    "children" | "defaultValue" | "value"
  > & {
    image?: string | null;
    defaultImage?: string | null;
    previewSize?: number;
    hidePreview?: boolean;
    inline?: boolean;
    onFileChange?: (file: File | null) => void;
    onFileUpload?(file: File | null): string;
  }
> = ({
  ref,
  className,
  image,
  defaultImage = null,
  previewSize = 128,
  hidePreview,
  inline,
  onFileChange,
  onFileUpload,
  ...props
}) => {
  // resolve the default image file
  const defaultImageFile = defaultImage
    ? new File([defaultImage], "default-image.png", {
      type: "image/png",
    })
    : null;
  // setup the avatar url state
  const [fileUrl, setFileUrl] = React.useState<string | null>(
    defaultImage || null,
  );
  // setup the current file state
  const [currentFile, setCurrentFile] = React.useState<File | null>(
    defaultImageFile,
  );
  // declare the uploading signal for indicating if the file is being uploaded
  const [isUploading, setIsUploading] = React.useState(false);
  // create a ref for the file input to reset it later
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  // returns true if the preview is not null and showPreview is true
  const showPreview = fileUrl !== null && !hidePreview;
  // handle any changes to the image
  const handleFileChange = (
    selectedFiles?: File[],
  ) => {
    // handle the case where no files are selected
    if (!selectedFiles) {
      logger.warn("No files selected");
      return;
    }
    logger.info(`User selected ${selectedFiles.length} files`);
    const selected = selectedFiles[0];
    // set the selected file
    setCurrentFile(selected);
    // create an object url for the file
    const imageUrl = URL.createObjectURL(selected);
    // set the preview
    setFileUrl(imageUrl);
    onFileChange?.(selected);
  };
  // a callback for handling the cancel action
  function handleClear() {
    logger.info("Clearing selected file");
    // reset to defaults
    setFileUrl(defaultImage);
    setCurrentFile(defaultImageFile);
  }
  // a callback for handling the upload event
  const handleUpload = async () => {
    // handle the case where no file is selected
    if (!currentFile) {
      logger.error("No file selected for upload...");
      return;
    }
    // ensure the uploading toggle is triggered
    if (!isUploading) setIsUploading(true);
    // trace the event
    logger.trace(`Uploading file ${currentFile.name}...`);
    // upload the avatar
    toast.promise(
      async () => {
        const uploadedUrl = await onFileUpload?.(currentFile);
        setFileUrl((prev) => {
          if (prev === uploadedUrl) return prev;
          return uploadedUrl ?? null;
        });
      },
      {
        loading: `Uploading ${currentFile?.name}...`,
        success: () => {
          setIsUploading(false);
          return "Avatar uploaded successfully!";
        },
        error: (error) => {
          // log the error
          logger.error(`Failed to upload avatar: ${error}`);
          // return the error message
          return `Failed to upload avatar: ${error}`;
        },
      },
    );
  };
  // render the component
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "flex flex-1 items-center gap-2 max-w-sm relative z-auto",
        inline ? "flex-nowrap" : "flex-wrap",
        className,
      )}
    >
      {showPreview && (
        <div
          className={cn(
            "relative z-auto shrink overflow-hidden rounded-full",
            "cursor-pointer border border-accent/10",
          )}
          style={{ width: previewSize, height: previewSize }}
        >
          <Image
            fill
            alt="Avatar preview"
            className="object-cover rounded-full cursor-pointer"
            src={fileUrl}
            onDoubleClick={(event) => {
              // prevent the default action
              event.preventDefault();
              // stop the event from bubbling up
              event.stopPropagation();
              // open the image in a new tab
              window.open(fileUrl, "_blank");
            }}
          />
        </div>
      )}
      <div className="flex flex-col flex-1 gap-2 w-full">
        <Label
          htmlFor="avatar-input"
          className="text-muted-foreground text-nowrap"
        >
          Select Avatar Image
        </Label>
        <div className="inline-flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
          <Input
            ref={fileInputRef}
            id="avatar-input"
            className="w-full"
            accept="image/*"
            type="file"
            onChange={(event) => {
              // prevent the default action
              event.preventDefault();
              // stop the event from bubbling up
              event.stopPropagation();
              // destructure the event target to expose the selection
              const { files } = event.target;
              // ensure that some files are selected
              if (files && files.length > 0) {
                // handle the image change
                handleFileChange(Array.from(files));
              } else {
                // log a warning if no files are selected
                logger.warn("No files selected");
              }
            }}
          />
          <Button
            size="icon"
            variant="destructive"
            disabled={!currentFile || isUploading}
            onClick={(event) => {
              // prevent the default action
              event.preventDefault();
              // stop the event from bubbling up
              event.stopPropagation();
              // handle the clear action
              handleClear();
            }}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        </div>
        <Button
          className="w-full"
          disabled={!currentFile || isUploading}
          onClick={(event) => {
            // prevent the default action
            event.preventDefault();
            // stop the event from bubbling up
            event.stopPropagation();
            // handle the upload
            handleUpload();
          }}
        >
          {isUploading
            ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                <span className="animate-pulse">Uploading...</span>
              </>
            )
            : (
              <>
                <UploadIcon className="h-4 w-4" />
                <span>Upload</span>
              </>
            )}
        </Button>
      </div>
    </div>
  );
};
ImagePicker.displayName = "ImagePicker";
