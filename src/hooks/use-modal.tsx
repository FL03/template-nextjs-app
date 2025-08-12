/**
 * Created At: 2025.08.10:14:16:28
 * @author - @FL03
 * @file - use-modal.tsx
 */
"use client";
// imports
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type UseModalState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
  close: () => void;
  open: () => void;
};

type UseModalOptions<TElem> = {
  target?: RefObject<TElem | null>;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

/** The `useModal` hook works to provide controller for a particular element. */
export const useModal = <TElem extends HTMLElement = HTMLDivElement>({
  target,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  onOpen,
  onClose,
}: UseModalOptions<TElem> = {}): UseModalState => {
  // setup the state for the modal
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  // create a ref for the target element
  const targetRef = useRef<TElem | null>(null);
  // memoize the target element
  const targetElement = useMemo(() => {
    if (target && target.current) {
      targetRef.current = target.current;
    }
    return targetRef.current;
  }, [target]);
  // toggle the modal state
  const handleChange = useCallback((open: boolean) => (
    setIsOpen((prev) => {
      // if the open state is the same, do nothing
      if (prev === open) return prev;
      // if provided, call the onOpenChange callback
      if (onOpenChange) onOpenChange(open);
      // return the new open state
      return open;
    })
  ), [onOpenChange]);
  // toggle the modal state
  const toggle = useCallback(() => {
    handleChange(!isOpen);
  }, [isOpen, handleChange]);
  // close the modal
  const close = useCallback((): void => {
    // close the modal
    handleChange(false);
    // use the onClose callback if provided
    onClose?.();
  }, [handleChange, onClose]);
  // open the modal
  const open = useCallback((): void => {
    // open the modal
    handleChange(true);
    // use the onOpen callback if provided
    onOpen?.();
  }, [handleChange, onOpen]);
  // effect to synchronize external state changes
  useEffect(() => {
    if (openProp !== undefined && openProp !== isOpen) {
      handleChange(openProp);
    }
  }, [openProp, isOpen, handleChange]);
  // effect to handle the target element
  useEffect(() => {
    if (targetElement) {
      targetRef.current = targetElement;
    }
    // if the modal is open, focus the target element
    if (isOpen && targetElement) {
      targetElement.focus();
    }
  }, [isOpen, targetElement]);

  // return the modal state and handlers
  return {
    isOpen,
    setIsOpen,
    toggle,
    close,
    open,
  };
};
