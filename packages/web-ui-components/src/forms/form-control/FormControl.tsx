import * as React from "react";

import { Label } from "../../shadcn-ui";

interface Props
  extends Omit<React.HTMLProps<HTMLDivElement>, "className" | "style"> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormControl = ({
  name,
  label,
  description,
  error,
  required,
  children,
}: Props) => {
  return (
    <div className="flex w-full flex-col space-y-1">
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label} {required && <span className="text-destructive-500">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-basic-500">{description}</p>
      )}
      {error && <p className="text-xs text-destructive-500">{error}</p>}
    </div>
  );
};
