// image-picker.tsx
"use client";
// imports
import * as React from "react";
import Image from "next/image";
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react";
// project
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
// components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImagePickerProps {
  className?: string;
  defaultImage?: string;
  previewSize?: number;
  hidePreview?: boolean;
  onImageSelect?: (file: File | null) => void;
  onImageUpdate?: (file: File | null) => void;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  className,
  hidePreview,
  onImageSelect,
  onImageUpdate,
  defaultImage,
  previewSize = 100,
}) => {
  // create a ref for the file input to reset it later
  const inputRef = React.useRef<HTMLInputElement>(null);
  // if provided, use the default image as a File object
  const defaultImageFile = defaultImage
    ? new File([defaultImage], "default-image.png", {
      type: "image/png",
    })
    : null;
  // setup the selected image state
  const [fileUrl, setFileUrl] = React.useState<string | undefined>(
    defaultImage,
  );
  // initialize the selected file state
  const [currentFile, setCurrentFile] = React.useState<File | null>(
    defaultImageFile,
  );
  // declare the uploading signal for tracking the upload event
  const [isUploading, setIsUploading] = React.useState(false);
  // determine if the preview should be rendered
  const showPreview = React.useMemo(() => !!fileUrl && !hidePreview, [
    fileUrl,
    hidePreview,
  ]);
  // the callback for handling any changes to the file input
  function handleFileChange(file: File) {
    // update the local state
    setCurrentFile(file);
    // create an object url for the file
    const imageUrl = URL.createObjectURL(file);
    // update the url state
    setFileUrl(imageUrl);
    // if provided, invoke the onImageSelect callback
    if (onImageSelect) onImageSelect(file);
    // finish
    return;
  }

  function handleCancel() {
    // reset the selected image using the default image
    setFileUrl(defaultImage);
    // reset the selected file

    if (defaultImage) {
      setCurrentFile(
        new File([defaultImage], "default-image.png", {
          type: "image/png",
        }),
      );
    } else {
    }
    setCurrentFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (onImageSelect) {
      onImageSelect(null);
    }
  }

  function handleUpdate() {
    if (!currentFile) {
      logger.warn("No file selected for upload");
      return;
    }
    if (!isUploading) setIsUploading(true);

    try {
      if (onImageUpdate) {
        onImageUpdate(currentFile);
      }
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Image Preview */}
        <div
          className="relative flex-shrink-0 rounded-full overflow-hidden border bg-muted"
          style={{ width: previewSize, height: previewSize }}
        >
          {showPreview &&
            (
              <Image
                fill
                className="object-cover"
                src={fileUrl || "/placeholder.svg"}
                alt="Selected image preview"
                onDoubleClick={(event) => {
                  // prevent the default action
                  event.preventDefault();
                  // stop the event from bubbling up
                  event.stopPropagation();
                  // open the image in a new tab
                  window.open(fileUrl, "_blank");
                }}
              />
            )}
        </div>

        {/* Input and Controls */}
        <div className="flex-1 w-full">
          {/* Input and Cancel Button Row */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <Input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  // prevent the default action
                  event.preventDefault();
                  // stop the event from bubbling up
                  event.stopPropagation();
                  // destructure the event target to expose the selection
                  const { files } = event.target;
                  // if any files are selected, handle them
                  if (files && files.length > 0) {
                    handleFileChange(files[0]);
                  }
                }}
                className="cursor-pointer"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(event) => {
                // prevent the default action
                event.preventDefault();
                // stop the event from bubbling up
                event.stopPropagation();
                // handle cancel
                handleCancel();
              }}
              className="flex-shrink-0"
              aria-label="Cancel selection"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Update Button */}
          <Button
            className="w-full"
            disabled={!currentFile}
            onClick={(event) => {
              // prevent the default action
              event.preventDefault();
              // stop the event from bubbling up
              event.stopPropagation();
              // handle cancel
              handleUpdate();
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
    </div>
  );
};
