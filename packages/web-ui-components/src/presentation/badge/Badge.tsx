import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Badge as ShadcnBadge } from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";

const badgeVariants = cva("text-sm rounded-full", {
  variants: {
    variant: {
      outlined:
        "border-basic bg-transpacent text-basic hover:border-basic-800 hover:bg-basic-100",
      destructive:
        "border-destructive-500 bg-destructive-500 text-destructive-100 hover:bg-destructive-400 hover:border-destructive-400",
      success:
        "border-success-500 bg-success-500 text-success-100 hover:bg-success-400 hover:border-success-400",
      info: "border-info-500 bg-info-500 text-info-100 hover:bg-info-400 hover:border-info-400",
      warning:
        "border-warning-500 bg-warning-500 text-warning-100 hover:bg-warning-400 hover:border-warning-400",
    },
  },
  defaultVariants: {
    variant: "outlined",
  },
});

interface Props extends VariantProps<typeof badgeVariants> {
  text: string;
  icon?: React.ReactNode;
  onAction?: () => void;
}

export function Badge({ text, icon, onAction, variant }: Props) {
  return (
    <ShadcnBadge
      className={cn(badgeVariants({ variant }), "flex items-center gap-1")}
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
