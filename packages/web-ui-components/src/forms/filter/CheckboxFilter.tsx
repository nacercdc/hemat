/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DropdownMenu } from "../../navigation";
import { cn } from "../../shadcn-ui/utils/cn";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CheckboxGroup } from "../checkbox/CheckboxGroup";
import type { DeepKeyOf } from "@etm/utilities";

import { cva } from "class-variance-authority";
import type { ButtonVariants } from "../button/Button";
import {
  colorVariants,
  sizeVariants,
  variantVariants,
  compoundVariants,
  defaultVariants,
} from "../button/Button";
import { Spinner } from "../../presentation";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: variantVariants,
      color: colorVariants,
      size: sizeVariants,
    },
    compoundVariants: compoundVariants as any,
    defaultVariants: defaultVariants as any,
  }
);

interface Props<T> {
  title: string;
  options?: T[];
  valueKey: DeepKeyOf<T>;
  labelKey: DeepKeyOf<T>;
  values?: T[];
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  color?: ButtonVariants["color"];
  loading?: boolean;
  emptyText?: string;
  onValuesChange: (values: T[]) => void;
}
export default function CheckboxFilter<T>({
  title,
  options,
  valueKey,
  labelKey,
  values,
  variant,
  size,
  color,
  emptyText = "No results found.",
  loading,
  onValuesChange,
}: Props<T>) {
  return (
    <DropdownMenu
      align="end"
      trigger={
        <div
          className={cn(
            buttonVariants({
              variant,
              size,
              color,
            }),
            "flex items-center gap-2 px-2 border-dark-lighter"
          )}
        >
          <span className="flex items-center gap-1.5">
            <Icon icon="solar:filter-linear" className="text-xl" />
            <span className="text-sm font-normal">{title}</span>
          </span>
          <Icon icon="stash:chevron-down-light" className="text-lg" />
        </div>
      }
      label={
        <div className="flex w-full min-w-40">
          {loading && (
            <div className="h-52 flex items-center w-full justify-center">
              <Spinner color="primary" size="sm" />
            </div>
          )}
          {!loading && options && options.length > 0 && (
            <CheckboxGroup<T>
              options={options ?? []}
              labelKey={labelKey}
              valueKey={valueKey}
              values={values}
              onValuesChange={onValuesChange}
            />
          )}

          {((!loading && !options) || (options && options.length === 0)) && (
            <div className="h-52 flex items-center w-full justify-center">
              <span>{emptyText}</span>
            </div>
          )}
        </div>
      }
    />
  );
}
