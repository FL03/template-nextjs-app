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

namespace UseModal {
  export type Hook = <TElem extends HTMLElement = HTMLDivElement>(
    props?: Props<TElem>,
  ) => Context;

  export interface Context {
    isOpen: boolean;
    setIsOpen(open: boolean): void;
    toggle(): void;
    close(): void;
    open(): void;
  }

  export interface Props<TElem extends HTMLElement> {
    closeOnEsc?: boolean;
    closeOnOutsideClick?: boolean;
    target?: RefObject<TElem | null>;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?(open: boolean): void;
  }
}

/** The `useModal` hook works to provide controller for a particular element. */
export function useModal<
  TElem extends HTMLElement = HTMLDivElement,
>({
  target,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  closeOnEsc = true,
  closeOnOutsideClick = true,
}: UseModal.Props<TElem> = {}): UseModal.Context {
  // uncontrolled state for when `openProp` is undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(
    defaultOpen,
  );

  // controlled check + derived current open state
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? Boolean(openProp) : uncontrolledOpen;

  // internal ref to the resolved target element
  const targetRef = useRef<TElem | null>(null);

  // save the previously focused element to restore on close
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // resolve target (accept RefObject or element)
  const targetElement = useMemo<TElem | null>(() => {
    // If target is a ref-like object
    if (!target) return targetRef.current;

    if (target instanceof Object && "current" in target) {
      targetRef.current = (target as RefObject<TElem | null>).current;
    } else if ((target as any) instanceof HTMLElement) {
      // If target is an element
      targetRef.current = target as TElem;
    }
    return targetRef.current;
  }, [target]);

  // unified updater that respects controlled/uncontrolled usage
  const updateOpen = useCallback(
    (next: boolean) => {
      if (isControlled) {
        // controlled: inform owner only
        if (onOpenChange) onOpenChange(next);
        return;
      }
      // uncontrolled: update internal state and inform owner
      setUncontrolledOpen((prev) => {
        if (prev === next) return prev;
        if (onOpenChange) onOpenChange(next);
        return next;
      });
    },
    [isControlled, onOpenChange],
  );

  // wrappers for the public API
  const setIsOpen = useCallback((open: boolean) => updateOpen(open), [
    updateOpen,
  ]);
  const toggle = useCallback(() => updateOpen(!isOpen), [isOpen, updateOpen]);
  const close = useCallback(() => updateOpen(false), [updateOpen]);
  const open = useCallback(() => updateOpen(true), [updateOpen]);

  // focus management: when opening, save previous active element and focus target;
  // when closing, restore previous focus.
  useEffect(() => {
    const el = targetElement;
    if (isOpen) {
      // save previous focus
      previouslyFocused.current = (document.activeElement as HTMLElement) ??
        null;
      // try focusing the target; if target is not focusable, try first focusable descendant
      if (el) {
        const tryFocus = (node: HTMLElement) => {
          try {
            node.focus();
            // if focus didn't land on node and node has descendants, try the first focusable
            if (document.activeElement !== node) {
              const firstFocusable = node.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
              );
              firstFocusable?.focus();
            }
          } catch {
            // ignore focus errors
          }
        };
        tryFocus(el);
      }
      return;
    }
    // restore focus when closed
    if (!isOpen && previouslyFocused.current) {
      try {
        previouslyFocused.current.focus();
      } catch {
        // ignore
      } finally {
        previouslyFocused.current = null;
      }
    }
  }, [isOpen, targetElement]);

  // Escape key handler to close modal
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        ev.stopPropagation();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeOnEsc, close]);

  // Click-outside handler to close modal
  useEffect(() => {
    if (!closeOnOutsideClick || !isOpen) return;
    const onPointer = (ev: PointerEvent) => {
      const root = targetElement;
      const targetNode = ev.target as Node | null;
      if (!root) {
        // if no root provided, ignore outside-click behavior
        return;
      }
      if (targetNode && !root.contains(targetNode)) {
        close();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [isOpen, closeOnOutsideClick, targetElement, close]);

  // keep internal targetRef up to date if target prop changed (for consumers that pass ref later)
  useEffect(() => {
    if (targetElement) targetRef.current = targetElement;
  }, [targetElement]);

  // return the modal state and handlers
  return {
    isOpen,
    setIsOpen,
    toggle,
    close,
    open,
  };
}
