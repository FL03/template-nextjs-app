/**
 * Created At: 2025.10.25:17:23:42
 * @author - @FL03
 * @directory - src/components/common
 * @file - form-toast.tsx
 */
"use client";
// imports
import React from "react";
import { useFormStatus } from "react-dom";

type Status = "idle" | "pending" | "success" | "error";

type FormToastContext = {
  status: string | null;
};

const FormToastContext = React.createContext<FormToastContext>({
  status: null,
});

export const useFormToast = (): FormToastContext => {
  const ctx = React.useContext(FormToastContext);

  if (!ctx) {
    throw new Error(
      "useFormToast must be used within a FormToastProvider",
    );
  }
  return ctx;
};

export const FormToast: React.FC<
  React.PropsWithChildren<
    {
      defaultValue?: Status;
      value?: Status;
      onValueChange?(status?: Status): void;
    }
  >
> = ({ children, value, defaultValue = "idle", onValueChange }) => {
  const { pending } = useFormStatus();

  const [status, setStatus] = React.useState<Status | null>(defaultValue);

  React.useEffect(() => {
    if (pending && status !== "pending") {
      setStatus("pending");
    } else if (value && value !== status) {
      setStatus(value);
    }
  }, [pending, status, value]);

  const handleStatusChange = React.useCallback((next?: Status | null) => {
    setStatus((prev) => {
      if (prev === next) return prev;
      if (next) onValueChange?.(next);
      return next ?? null;
    });
  }, [onValueChange]);

  const ctx = React.useMemo(() => ({ status }), [status]);
  return (
    <FormToastContext.Provider value={ctx}>
      {children}
    </FormToastContext.Provider>
  );
};
