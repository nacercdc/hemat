import { Icon } from "@iconify/react/dist/iconify.js";
import type { ButtonHTMLAttributes, ForwardedRef } from "react";
import React from "react";
import { cn } from "~/utils/cn.util";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const HorizontalDotButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, ...props }, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      ref={ref}
      className={cn(
        "bg-tbaccent/60 h-fit flex items-center justify-center rounded-2xl py-0.5 px-1",
        className
      )}
    >
      <Icon
        icon="ph:dots-three-outline-fill"
        className="w-4 h-4 text-basic-600"
      />
    </button>
  );
});
