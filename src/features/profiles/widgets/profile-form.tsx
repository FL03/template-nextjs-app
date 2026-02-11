/**
 * Created At: 2025.07.17:11:16:10
 * @author - @FL03
 * @file - profile-form.tsx
 */
'use client';
// imports
import * as React from 'react';
import { toast } from 'sonner';
// project
import { OrgSelect } from '@/features/orgs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useModal } from '@/hooks/use-modal';
import { cn } from '@/lib/utils';
import type { FormProps, PropsWithForm, PropsWithModal } from '@/types';
// feature-specific
import { type ProfileData } from '../types';
import { updateProfileAction } from '../utils';
// components
import { IconButton, SaveButton } from '@/components/common/button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, XIcon } from 'lucide-react';

export const ProfileForm: React.FC<
  React.PropsWithChildren<
    FormProps<
      Partial<ProfileData>,
      {
        showLegend?: boolean;
      }
    >
  >
> = ({
  ref,
  children,
  className,
  defaultValues,
  values,
  showLegend,
  onCancel,
  onError,
  onSuccess,
  ...props
}) => {
  const [formState, formAction, isPending] = React.useActionState(
    updateProfileAction,
    {
      mode: 'update',
    },
  );
  // define the toast ref
  const toastRef = React.useRef<string | number | null>(null);
  // form effects
  React.useEffect(() => {
    if (formState.status && ['idle', 'init'].includes(formState.status)) {
      return;
    }
    if (isPending) {
      toastRef.current ??= toast.loading('Saving...', {
        id: 'profile-form-toast',
        duration: 3000,
      });
    }
    if (formState.status === 'error') {
      toastRef.current ??= toast.error(`Error: ${formState.message}`, {
        id: 'profile-form-toast',
        duration: 5000,
      });
      onError?.(formState.error);
      formState.status = 'idle'; // reset status to idle after handling error
    } else if (formState.status === 'success') {
      toastRef.current ??= toast.success('Success! Saved the user profile', {
        id: 'profile-form-toast',
      });
      onSuccess?.();
      formState.status = 'idle'; // reset status to idle after handling success
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
      ref={ref}
      id='profile-form'
      className={cn('relative z-auto flex flex-1 flex-col w-full', className)}
      action={formAction}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          event.currentTarget.requestSubmit();
        }
        if (event.key === 'Escape') {
          event.currentTarget.reset();
          onCancel?.();
        }
      }}
      {...props}
    >
      <FieldSet form='profile-form'>
        <FieldLegend
          className={cn('text-lg', showLegend ? 'not-sr-only' : 'sr-only')}
        >
          Profile
        </FieldLegend>
        <FieldDescription
          className={cn(showLegend ? 'not-sr-only' : 'sr-only')}
        >
          Update and customize your profile
        </FieldDescription>
        <FieldGroup>
          <>
            {/* Username */}
            <Field orientation='responsive'>
              <FieldContent>
                <FieldLabel htmlFor='username'>Username</FieldLabel>
              </FieldContent>
              <Input
                id='username'
                name='username'
                placeholder='Username...'
                type='text'
                defaultValue={defaultValues?.username}
                value={values?.username}
              />
            </Field>
            {/* Primary Organization */}
            <Field orientation='responsive'>
              <FieldContent>
                <FieldLabel>Organization</FieldLabel>
                <FieldDescription>
                  Select a default organization for this profile.
                </FieldDescription>
              </FieldContent>
              <OrgSelect
                name='primary_organization'
                defaultValue={defaultValues?.primary_organization ?? undefined}
                value={values?.primary_organization ?? undefined}
              />
            </Field>
          </>
          <FieldSeparator />
          <>
            {/* Display Name */}
            <Field orientation='responsive'>
              <FieldContent>
                <FieldLabel htmlFor='display_name'>Display Name</FieldLabel>
              </FieldContent>
              <Input
                id='display_name'
                name='display_name'
                placeholder='Display Name'
                type='text'
                defaultValue={defaultValues?.display_name ?? undefined}
                value={values?.display_name ?? undefined}
              />
            </Field>
            {/* first */}
            <Field orientation='responsive'>
              <FieldContent>
                <FieldLabel htmlFor='first_name'>First Name</FieldLabel>
              </FieldContent>
              <Input
                autoCapitalize='words'
                id='first_name'
                name='first_name'
                placeholder='First Name'
                type='text'
                defaultValue={defaultValues?.first_name ?? undefined}
                value={values?.first_name ?? undefined}
              />
            </Field>
            {/* Middle Name */}
            <Field orientation='responsive'>
              <FieldContent>
                <FieldLabel htmlFor='middle_name'>Middle Name</FieldLabel>
              </FieldContent>
              <Input
                id='middle_name'
                name='middle_name'
                placeholder='Middle Name'
                type='text'
                defaultValue={defaultValues?.middle_name ?? undefined}
                value={values?.middle_name ?? undefined}
              />
            </Field>
            {/* last name */}
            <Field orientation='responsive'>
              <FieldContent>
                <FieldLabel htmlFor='last_name'>Last Name</FieldLabel>
              </FieldContent>
              <Input
                id='last_name'
                name='last_name'
                placeholder='Last Name'
                type='text'
                defaultValue={defaultValues?.last_name ?? undefined}
                value={values?.last_name ?? undefined}
              />
            </Field>
            {/* bio */}
            <Field orientation='responsive'>
              <FieldContent>
                <FieldLabel htmlFor='bio'>Bio</FieldLabel>
              </FieldContent>
              <Textarea
                id='bio'
                name='bio'
                placeholder='Bio'
                rows={3}
                defaultValue={defaultValues?.bio ?? undefined}
                value={values?.bio ?? undefined}
              />
            </Field>
          </>
          {/* Hidden Fields */}
          <Field>
            <Input
              readOnly
              id='profile-id'
              name='id'
              type='hidden'
              defaultValue={defaultValues?.id}
              value={values?.id}
            />
          </Field>
          {/* actions */}
          <Field orientation='responsive'>
            <SaveButton
              className='w-full'
              id='profile-form-submit'
              data-testid='profile-form-submit'
              form='profile-form'
              type='submit'
              isSaving={isPending}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export const ProfileFormDrawer: React.FC<
  PropsWithForm<
    React.PropsWithChildren<
      PropsWithModal<{
        className?: string;
        title?: React.ReactNode;
        description?: React.ReactNode;
      }>
    >,
    ProfileData
  >
> = ({
  children,
  className,
  description = 'Create or update a user profile',
  title = 'Profile',
  defaultOpen,
  open,
  onOpenChange,
  onCancel,
  onSuccess,
  ...props
}) => (
  <Drawer open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
    {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
    <DrawerContent className='max-w-lg max-h-full'>
      <div className={className}>
        <DrawerHeader>
          {title && <DrawerTitle>{title}</DrawerTitle>}
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <DrawerFooter className='flex flex-1 flex-col w-full'>
          <ProfileForm
            onCancel={() => {
              onOpenChange?.(false);
              onCancel?.();
            }}
            onSuccess={() => {
              onOpenChange?.(false);
              onSuccess?.();
            }}
            {...props}
          />
          <DrawerClose asChild>
            <IconButton label='Close' className='w-full'>
              <XIcon className='size-5' />
            </IconButton>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
);

export const ProfileFormDialog: React.FC<
  PropsWithForm<
    React.PropsWithChildren<
      PropsWithModal<{
        className?: string;
        title?: React.ReactNode;
        description?: React.ReactNode;
      }>
    >,
    ProfileData
  >
> = ({
  children,
  className,
  description,
  title,
  defaultOpen,
  open,
  onOpenChange,
  onCancel,
  onSuccess,
  ...props
}) => (
  <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
    {children && <DialogTrigger asChild>{children}</DialogTrigger>}
    <DialogContent className={cn('max-w-lg', className)}>
      <DialogHeader>
        {title && <DialogTitle>{title}</DialogTitle>}
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <DialogFooter>
        <ProfileForm
          onCancel={() => {
            onOpenChange?.(false);
            onCancel?.();
          }}
          onSuccess={() => {
            onOpenChange?.(false);
            onSuccess?.();
          }}
          {...props}
        />
        <DialogClose />
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const ProfileFormModal: React.FC<
  PropsWithForm<
    PropsWithModal<{
      className?: string;
      description?: React.ReactNode;
      title?: React.ReactNode;
      triggerLabel?: string;
      triggerVariant?: React.ComponentProps<typeof IconButton>['variant'];
      triggerSize?: React.ComponentProps<typeof IconButton>['size'];
    }>,
    ProfileData
  >
> = ({
  defaultOpen,
  open,
  onOpenChange,
  description = 'Create or update a user profile',
  title = 'Profile',
  triggerLabel = 'Edit Profile',
  triggerVariant = 'outline',
  triggerSize = 'default',
  ...props
}) => {
  // hooks
  const isMobile = useIsMobile();
  const modal = useModal({ defaultOpen, open, onOpenChange });

  const renderTrigger = () => (
    <IconButton
      onClick={modal.toggle}
      label={triggerLabel}
      size={triggerSize}
      variant={triggerVariant}
    >
      <PlusIcon className='size-5' />
    </IconButton>
  );
  // render the drawer on mobile; otherwise render a dialog
  return isMobile ? (
    <ProfileFormDrawer
      description={description}
      title={title}
      open={modal.isOpen}
      onOpenChange={modal.setIsOpen}
      {...props}
    >
      {renderTrigger()}
    </ProfileFormDrawer>
  ) : (
    <ProfileFormDialog
      description={description}
      title={title}
      open={modal.isOpen}
      onOpenChange={modal.setIsOpen}
      {...props}
    >
      {renderTrigger()}
    </ProfileFormDialog>
  );
};
ProfileFormModal.displayName = 'ProfileFormModal';
