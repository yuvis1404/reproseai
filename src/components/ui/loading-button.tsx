import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
}

export function LoadingButton({
  isLoading,
  loadingText = "Please wait...",
  children,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={cn(
        "relative transition-all duration-200",
        isLoading
          ? "bg-[length:200%_100%] bg-gradient-to-r from-brand via-brand-violet to-brand"
          : "",
        className
      )}
      disabled={isDisabled}
      style={{
        backgroundSize: isLoading ? "200% 100%" : undefined,
        animation: isLoading ? "shimmer 1.5s linear infinite" : undefined,
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin h-4 w-4 mr-2" strokeWidth={3} />
          {loadingText}
        </>
      ) : (
        children
      )}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </button>
  );
}