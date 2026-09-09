import * as React from "react";
import { cn } from "@/lib/utils";

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export function RippleButton({
  className,
  children,
  onClick,
  ...props
}: RippleButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const circle = document.createElement("div");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const circleSize = `${diameter}px`;
    circle.style.width = circleSize;
    circle.style.height = circleSize;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.style.position = "absolute";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    circle.style.transform = "scale(0)";
    circle.style.animation = "ripple 600ms ease-out";
    circle.style.pointerEvents = "none";

    // Add the animation to the document if it doesn't exist yet
    if (!document.getElementById("ripple-button-style")) {
      const style = document.createElement("style");
      style.id = "ripple-button-style";
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.appendChild(circle);

    // Remove the circle after animation completes
    setTimeout(() => {
      circle.remove();
    }, 600);

    // Call the original onClick handler
    onClick?.(e);
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}