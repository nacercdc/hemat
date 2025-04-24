"use client";

import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { cva } from "class-variance-authority";
import get from "lodash.get";

import type { DeepKeyOf } from "@etm/utilities";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";
import type { FormControlVariants } from "../form-control";
import { FormControl } from "../form-control";
import { CommandLoading } from "cmdk";
import { Spinner } from "../../presentation";

const selectVariants = cva("w-full font-normal", {
  variants: {
    variant: {
      default: "border border-input bg-card hover:bg-card",
      destructive:
        "border border-destructive bg-destructive text-destructive-foreground",
      success: "text-success-foreground border border-success",
      info: "text-info-foreground border border-info",
      warning: "text-warning-foreground border border-warning",
    },
    size: {
      sm: "px-2 h-8 py-1 text-xs",
      md: "px-3 h-9 py-2 text-xs",
      lg: "px-4 h-10 py-2 text-xs",
      xl: "px-4 h-12 rounded-2 border-[1px] text-sm max-[770px]:text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface Props<T>
  extends Omit<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      "size" | "className" | "style" | "defaultValue" | "onSelect" | "value"
    >,
    VariantProps<typeof selectVariants> {
  options: T[];
  value?: T;
  displayLabel?: string;
  valueKey: DeepKeyOf<T>;
  labelKey: DeepKeyOf<T>;
  displayDescription?: string;
  placeholder?: string;
  leftNode?: React.ReactNode;
  searchPlaceholder?: string;
  emptyText?: string;
  align?: "start" | "center" | "end";
  labelVariant?: FormControlVariants["variant"];
  labelSize?: FormControlVariants["size"];
  error?: string;
  inModal?: boolean;
  loading?: boolean;
  onOpenChange?: () => void;
  onSelect: (value?: T) => void;
}

export function Select<T>({
  name,
  options,
  value,
  displayLabel,
  displayDescription,
  valueKey,
  labelKey,
  leftNode,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  size,
  variant,
  align = "start",
  labelVariant,
  labelSize,
  error,
  loading,
  inModal = false,
  onSelect,
  onOpenChange,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

  const filteredOptions = options.filter((option) =>
    String(get(option, labelKey))
      .toLowerCase()
      .includes(String(searchValue).toLowerCase())
  );

  const selectedOption = options.find(
    (option) => String(get(option, valueKey)) === String(get(value, valueKey))
  );

  const onSelectHandler = (option: T) => {
    const newValue =
      get(option, valueKey) === get(value, valueKey) ? undefined : option;
    onSelect(newValue);
    setOpen(false);
    setSearchValue("");
  };

  const onOpenChangeHandler = (isOpen: boolean) => {
    setOpen(isOpen);
    if (buttonRef.current && isOpen) {
      onOpenChange?.();
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  };
  return (
    <FormControl
      name={name}
      label={displayLabel}
      error={error}
      description={displayDescription}
      variant={labelVariant}
      size={labelSize}
    >
      <Popover open={open} onOpenChange={onOpenChangeHandler} modal={inModal}>
        <PopoverTrigger asChild className="flex items-center w-full">
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              selectVariants({ variant, size }),
              error && "border-destructive-500",
              "justify-between text-sm relative flex"
            )}
          >
            <div className="flex items-center gap-2">
              {leftNode && (
                <span className="shrink-0 opacity-50">{leftNode}</span>
              )}
              {selectedOption ? (
                <span>{String(get(selectedOption, labelKey))}</span>
              ) : (
                <span className="text-dark-light text-sm">{placeholder}</span>
              )}
            </div>
            <Icon
              icon={"lucide:chevron-down"}
              className="h-4 w-4 shrink-0 opacity-50"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-fit p-0 border border-input"
          align={align}
          style={{ width: buttonWidth }}
        >
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              onValueChange={(value) => setSearchValue(value)}
            />
            <CommandList>
              <CommandLoading>
                {loading && (
                  <div className="flex items-center justify-center w-full h-36">
                    <Spinner color="primary" size="sm" />
                  </div>
                )}
              </CommandLoading>
              <CommandEmpty>{!loading && emptyText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option, index) => {
                  return (
                    <CommandItem
                      key={index}
                      value={String(get(option, labelKey))}
                      onSelect={() => onSelectHandler(option)}
                      className="w-full items-center justify-between flex"
                    >
                      {String(get(option, labelKey))}

                      <Icon
                        icon="lucide:check"
                        className={`ml-2 h-4 w-4 text-dark ${
                          String(get(value, valueKey)) ===
                          String(get(option, valueKey))
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormControl>
  );
}
