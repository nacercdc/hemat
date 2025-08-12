import { Badge as ShadcnBadge } from "../../shadcn-ui";
import { cva } from "class-variance-authority";
import { cn } from "../../shadcn-ui/utils/cn";
import type { VariantProps } from "class-variance-authority";

const badgeVariants = cva("text-xs font-medium p-0.5 px-2", {
  variants: {
    variant: {
      outlined:
        "border-dark-light bg-transparent text-dark-light hover:bg-dark-lighter",
      destructive: "bg-destructive/10 text-destructive hover:bg-destructive/15",
      success: "bg-success/10 text-success hover:bg-success/15",
      info: "bg-info/5 text-info-500 hover:bg-info/15",
      warning: "bg-warning-500/10 text-warning-500 hover:bg-warning/15",
      dark: "bg-dark-lighter/10 text-dark hover:bg-dark-lighter/15",
      light: "bg-primary text-white hover:bg-primary/80",
      progress: "bg-secondary-300/10 text-secondary-300 hover:bg-secondary/15",
    },
    shape: {
      rectangular: "rounded-sm",
      circular: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "outlined",
    shape: "rectangular",
  },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

interface Props extends BadgeVariants {
  text: React.ReactNode;
  icon?: React.ReactNode;
  onAction?: () => void;
}

export function Badge({ text, icon, onAction, variant, shape }: Props) {
  return (
    <ShadcnBadge
      className={cn(
        badgeVariants({ variant, shape }),
        "flex items-center gap-1 max-h-7 w-fit text-xs font-medium",
        !onAction && "justify-center"
      )}
    >
      {text}
      {icon && onAction && (
        <div
          className={cn(
            "flex items-center cursor-pointer",
            variant === "outlined" ? "text-basic" : `text-${variant}-100`
          )}
          onClick={onAction}
        >
          {icon}
        </div>
      )}
    </ShadcnBadge>
  );
}
