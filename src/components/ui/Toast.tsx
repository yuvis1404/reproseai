import { useEffect, useState } from "react";

import type { Toast, ToastType } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";

const accents: Record<ToastType, { bar: string; icon: string; text: string; glyph: string }> = {
  success: { bar: "#10B981", icon: "#10B981", text: "#10B981", glyph: "✓" },
  error: { bar: "#EF4444", icon: "#EF4444", text: "#EF4444", glyph: "✕" },
  info: { bar: "#6C3AE8", icon: "#6C3AE8", text: "#6C3AE8", glyph: "✨" },
  warning: { bar: "#F59E0B", icon: "#F59E0B", text: "#F59E0B", glyph: "⚡" },
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const accent = accents[toast.type];
  const duration = toast.duration ?? 4000;

  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => onDismiss(toast.id), 300);
    return () => window.clearTimeout(id);
  }, [leaving, onDismiss, toast.id]);

  function handleClose() {
    setLeaving(true);
  }

  return (
    <div
      role="status"
      className={cn(
        "relative flex min-w-[300px] max-w-[400px] items-center gap-3 overflow-hidden rounded-[14px] bg-[#1A1035] p-[14px_16px] shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        leaving ? "toast-exit" : "toast-enter",
      )}
      style={{ padding: "14px 16px" }}
    >
      {/* Left accent bar */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[4px]"
        style={{ background: accent.bar }}
      />

      {/* Icon circle */}
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-full text-[15px] font-bold"
        style={{ color: accent.icon, background: `${accent.icon}1A` }}
      >
        {accent.glyph}
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold text-white">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-[13px] leading-5 text-[#C4B5FD]">{toast.description}</p>
        ) : null}
      </div>

      {/* Close button */}
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={handleClose}
        className="grid size-6 shrink-0 place-items-center rounded-full text-[#C4B5FD]/70 transition-colors duration-150 hover:bg-white/10 hover:text-white"
      >
        <span className="text-[12px]" aria-hidden="true">
          ✕
        </span>
      </button>

      {/* Progress bar */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[3px]"
        style={{
          background: accent.bar,
          animation: `progress-shrink ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div aria-live="polite" className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
