'use client';
// imports
import * as React from 'react';
// components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


type ProfileAvatarPropsT = { placeholder?: string; src?: string | null; };

/**
 * The `ProfileAvatar` component is a customizable avatar component that displays a user's profile picture.
 */
export const ProfileAvatar: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Avatar>, 'alt' | 'src' | 'children'> &
    ProfileAvatarPropsT
> = ({ ref, src, placeholder = 'profile.png', ...props }) => {
  // render the avatar
  return (
    <Avatar ref={ref} {...props}>
      <AvatarImage
        className="object-cover"
        src={src ?? placeholder}
        alt="Profile Avatar"
      />
      <AvatarFallback>Profile Avatar</AvatarFallback>
    </Avatar>
  );
};
ProfileAvatar.displayName = 'ProfileAvatar';

export default ProfileAvatar;
