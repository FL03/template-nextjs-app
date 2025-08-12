/**
 * Created At: 2025.07.17:09:48:01
 * @author - @FL03
 * @file - form-modal.tsx
 */
// imports
import * as React from 'react';
// hooks
import { useIsMobile } from '@/hooks/use-mobile';
// components
import { FormDialogWithTrigger } from './form-dialog';
import { FormSheet } from './form-sheet';
import { ModalWithTriggerProps } from './types';

/** The `FormModal` component renders the form as a sheet on mobile platforms and viewports while rendering as a dialog on larger screens. */
export const FormModal: React.FC<React.PropsWithChildren<ModalWithTriggerProps>> = ({
  ...props
}) => {
  // check if the viewport is considered mobile
  const isMobile = useIsMobile();
  // render the FormSheet component for mobile devices
  if (isMobile) {
    return <FormSheet side="bottom" {...props} />;
  }
  // render the dialog
  return <FormDialogWithTrigger {...props} />;
};
FormModal.displayName = 'FormModal';

export default FormModal;
