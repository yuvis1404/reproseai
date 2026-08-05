import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const fieldClass =
  "h-12 w-full rounded-[10px] border border-[oklch(0.92_0.01_265)] bg-paper px-3.5 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-gray-muted/70 focus:border-brand focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-brand)_18%,transparent)]";

export function AuthField({
  label,
  className,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className="text-left">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </label>
      <input id={id} className={cn(fieldClass, className)} {...props} />
    </div>
  );
}

export function passwordScore(value: string) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  showStrength = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  autoComplete?: string;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const score = passwordScore(value);
  const meta = [
    { label: "Too weak", color: "bg-destructive", width: "20%" },
    { label: "Weak", color: "bg-destructive", width: "35%" },
    { label: "Fair", color: "bg-[oklch(0.79_0.16_80)]", width: "60%" },
    { label: "Good", color: "bg-[oklch(0.72_0.17_150)]", width: "80%" },
    { label: "Strong", color: "bg-[oklch(0.65_0.18_150)]", width: "100%" },
  ][score]!;

  return (
    <div className="text-left">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(fieldClass, "pr-11")}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-muted transition-colors hover:text-brand"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[oklch(0.93_0.01_265)]">
            <div
              className={cn("h-full rounded-full transition-all duration-300", meta.color)}
              style={{ width: meta.width }}
            />
          </div>
          <span className="text-[11px] font-semibold text-gray-muted">{meta.label}</span>
        </div>
      )}
    </div>
  );
}

export function GradientButton({
  children,
  loading = false,
  loadingLabel = "Please wait...",
  type = "submit",
  onClick,
}: {
  children: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-br from-brand to-brand-violet text-[16px] font-bold text-paper transition-all duration-200 hover:scale-[1.01] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-[oklch(0.92_0.01_265)]" />
      <span className="text-[12px] font-medium text-gray-muted">or</span>
      <span className="h-px flex-1 bg-[oklch(0.92_0.01_265)]" />
    </div>
  );
}

export function GoogleButton({
  onClick,
  disabled,
  loading = false,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className="flex h-12 w-full items-center justify-center gap-2.5 rounded-[10px] border border-[oklch(0.92_0.01_265)] bg-paper text-[15px] font-semibold text-ink transition-colors duration-200 hover:bg-[oklch(0.97_0.005_265)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          Redirecting to Google...
        </>
      ) : (
        <>
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.5 2.4 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v8.3h12.5c-.3 2.1-1.6 5.2-4.7 7.3l7.6 5.9c4.5-4.2 6.7-10.3 6.7-17.4z"
        />
        <path
          fill="#FBBC05"
          d="M10.4 28.7A14.6 14.6 0 0 1 9.6 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2 1.4-4.8 2.4-8.3 2.4-6.4 0-11.7-3.7-13.6-9l-7.8 6.1C6.5 42.6 14.6 48 24 48z"
        />
      </svg>
      Continue with Google
        </>
      )}
    </button>
  );
}
