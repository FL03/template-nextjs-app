/**
 * Created At: 2025.07.13:12:20:20
 * @author - @FL03
 * @file - profile-links.tsx
 */
'use client';
// imports
import * as React from 'react';
import Link from 'next/link';
// project
import { cn } from '@/lib/utils';

type ProfileLinkItemT = {
  href: React.ComponentProps<typeof Link>['href'];
  icon?: React.ReactNode;
  label?: string;
};

// TODO: Enable the owner to customize the individual links
/**
 * The `ProfileLink` component renders the individual link item with an optional icon and label.
 */
const ProfileLink: React.FC<
  Omit<React.ComponentPropsWithRef<'li'>, 'children' | 'title'> & {
    link: ProfileLinkItemT;
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link';
  }
> = ({
  ref,
  className,
  link,
  size = 'default',
  variant = 'link',
  ...props
}) => {
  // deconstruct the link item
  const { href, icon, label } = link;
  // convert the href to a string if it is not already
  const url = typeof href === 'string' ? href : href.toString();
  // render the link component
  return (
    <li
      {...props}
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 text-foreground transition-colors hover:italic hover:text-foreground/75 hover:rounded-2xl hover:cursor-pointer',
        className,
      )}
    >
      <Link href={href} className='flex items-center gap-2'>
        {icon && <span className='text-lg'>{icon}</span>}
        <span>{label || url}</span>
      </Link>
    </li>
  );
};
ProfileLink.displayName = 'ProfileLink';

/**
 * The `ProfileLinks` component renders a list of links the user has configured on their profile. Each link **must** contain a valid `href` and can optionally include an `icon` and `label`.
 */
export const ProfileLinks: React.FC<
  Omit<React.ComponentPropsWithoutRef<'ul'>, 'children' | 'title'> & {
    links?: ProfileLinkItemT[];
  }
> = ({ className, links = [], ...props }) => {
  // render the elements of the list
  const renderElements = () => (
    <>
      {links.map((link, idx) => (
        <ProfileLink key={idx} link={link} />
      ))}
    </>
  );
  // render the links component
  return (
    <ul {...props} className={cn('flex flex-col gap-2', className)}>
      {renderElements()}
    </ul>
  );
};
ProfileLinks.displayName = 'ProfileLinks';

export default ProfileLinks;
