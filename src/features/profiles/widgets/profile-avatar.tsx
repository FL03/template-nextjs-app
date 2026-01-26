/**
 * Created At: 2025.11.07:13:56:50
 * @author - @FL03
 * @directory - src/features/profiles/widgets
 * @file - profile-avatar.tsx
 */
"use client";
// imports
import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
// local
import { uploadAvatar } from "../utils";
// components
import { ImagePicker } from "@/components/common/image-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ProfileImage: React.FC<React.ComponentPropsWithRef<typeof Image>> =
  (
    { ref, ...props },
  ) => <Image ref={ref} {...props} />;
/**
 * The `ProfileAvatar` component is a customizable avatar component that displays a user's profile picture.
 */
export const ProfileAvatar: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof Avatar>,
    "children"
  > & {
    alt?: string;
    src?: string | null;
  }
> = ({ ref, alt = "Profile Avatar", src = "profile.png", ...props }) => (
  <Avatar ref={ref} {...props}>
    <AvatarImage
      className="object-cover"
      alt={alt}
      src={src || "profile.png"}
    />
    <AvatarFallback>Profile Avatar</AvatarFallback>
  </Avatar>
);

export const AvatarPicker: React.FC<
  Omit<
    React.ComponentPropsWithRef<typeof ImagePicker>,
    "children" | "defaultValue" | "value" | "onFileUpload"
  >
> = ({
  ref,
  ...props
}) => (
  <ImagePicker
    ref={ref}
    onFileUpload={(file) => {
      let url: string = "";
      toast.promise(uploadAvatar(file).then((u) => url = u), {
        loading: "Uploading avatar...",
        success: "Avatar uploaded successfully!",
        error: "Failed to upload avatar.",
      });
      return url;
    }}
    {...props}
  />
);
