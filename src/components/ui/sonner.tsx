import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      duration={4000}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-paper group-[.toaster]:text-ink group-[.toaster]:border group-[.toaster]:border-[oklch(0.93_0.01_265)] group-[.toaster]:border-l-4 group-[.toaster]:border-l-brand group-[.toaster]:shadow-[0_10px_30px_rgba(13,10,26,0.14)] group-[.toaster]:rounded-xl",
          success: "group-[.toaster]:border-l-[#16a34a]",
          error: "group-[.toaster]:border-l-[#dc2626]",
          info: "group-[.toaster]:border-l-brand",
          warning: "group-[.toaster]:border-l-[#ea580c]",
          description: "group-[.toast]:text-gray-muted",
          closeButton:
            "group-[.toast]:bg-paper group-[.toast]:text-gray-muted group-[.toast]:border-[oklch(0.93_0.01_265)]",
          actionButton: "group-[.toast]:bg-brand group-[.toast]:text-paper",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
