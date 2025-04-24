"use client";

import React from "react";

type SizeType = "sm" | "md" | "lg" | "xl";
type ColorType =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive";

interface Props {
  size: SizeType;
  color: ColorType;
}

export function Spinner({ size = "md", color = "primary" }: Props) {
  const sizeClasses: Record<SizeType, string> = {
    sm: "h-4 w-4 border-[1px]",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const colorClasses = {
    primary: "border-primary",
    secondary: "border-secondary",
    success: "border-success",
    destructive: "border-destructive",
    warning: "border-warning",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-solid ${colorClasses[color]} border-r-transparent  ${sizeClasses[size]}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
