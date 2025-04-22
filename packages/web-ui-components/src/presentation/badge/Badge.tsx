import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Badge as ShadcnBadge } from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";

const badgeVariants = cva("text-sm", {
  variants: {
    variant: {
      outlined:
        "border-dark-light bg-transpacent text-dark-light hover:bg-dark-lighter",
      destructive:
        "border-destructive-400 bg-destructive-100 text-destructive hover:bg-destructive-200",
      success:
        "border-success-400 bg-success-100 text-success hover:bg-success-200",
      info: "border-info-400 bg-info-100 text-info hover:bg-info-200",
      warning:
        "border-warning-400 bg-warning-100 text-warning hover:bg-warning-200",
      dark: "border-dark-lighter bg-dark-lighter text-dark-light",
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
  text: string;
  icon?: React.ReactNode;
  onAction?: () => void;
}

export function Badge({ text, icon, onAction, variant, shape }: Props) {
  return (
    <ShadcnBadge
      className={cn(
        badgeVariants({ variant, shape }),
        "flex items-center gap-1 max-h-7 w-fit",
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
