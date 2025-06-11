import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Progress as ShadcnProgress } from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";

const sizeVariants = {
  sm: "!h-1",
  md: "!h-2",
  lg: "!h-3",
  xl: "!h-4",
};

const shapeVariants = {
  rectangular: "rounded-sm",
  circular: "rounded-full",
};

const progressVariants = cva("relative w-full overflow-hidden", {
  variants: {
    size: sizeVariants,
    shape: shapeVariants,
  },
  defaultVariants: {
    size: "md",
    shape: "rectangular",
  },
});

export type ProgressVariants = VariantProps<typeof progressVariants>;

type ShadcnProgressPropsWithoutClassname = Omit<
  React.ComponentProps<typeof ShadcnProgress>,
  "className" | "style" | "size" | "color"
>;

interface Props extends ShadcnProgressPropsWithoutClassname {
  color?: string;
  size?: ProgressVariants["size"];
  shape?: ProgressVariants["shape"];
}

function Progress(props: Props) {
  const { color, size, shape, ...rest } = props;

  return (
    <ShadcnProgress
      color={color}
      className={cn(progressVariants({ size, shape }))}
      {...rest}
    />
  );
}

export { Progress, progressVariants };
