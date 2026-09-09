import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ToastContainer } from "@/components/ui/Toast";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastApi {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idCounter = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const add = useCallback(
    (type: ToastType, title: string, description?: string, duration?: number) => {
      const id = `toast-${++idCounter.current}`;
      const ms = duration ?? DEFAULT_DURATION;
      const toast: Toast = { id, type, title, duration: ms };
      if (description !== undefined) toast.description = description;
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => remove(id), ms);
    },
    [remove],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, description) => add("success", title, description),
      error: (title, description) => add("error", title, description),
      info: (title, description) => add("info", title, description),
      warning: (title, description) => add("warning", title, description),
    }),
    [add],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
