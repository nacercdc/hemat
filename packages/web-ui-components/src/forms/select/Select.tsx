import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { cva } from "class-variance-authority";
import get from "lodash.get";

import type { DeepKeyOf } from "@e-market/utilities";

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
import { FormControl } from "../form-control";

const selectVariants = cva("w-full", {
  variants: {
    variant: {
      default: "border border-input bg-background text-foreground",
      destructive:
        "border border-destructive bg-destructive text-destructive-foreground",
      success: "text-success-foreground border border-success",
      info: "text-info-foreground border border-info",
      warning: "text-warning-foreground border border-warning",
    },
    size: {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-3 text-lg",
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
      "size" | "className" | "style" | "defaultValue" | "onSelect"
    >,
    VariantProps<typeof selectVariants> {
  options: T[];
  displayLabel?: string;
  displayDescription?: string;
  valueKey: DeepKeyOf<T>;
  labelKey: DeepKeyOf<T>;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  onSelect: (value: T | undefined) => void;
  defaultValue?: T;
  error?: string;
}

export function Select<T>({
  name,
  displayLabel,
  displayDescription,
  options,
  valueKey,
  labelKey,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  onSelect,
  defaultValue,
  size,
  variant,
  error,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<T | undefined>(
    defaultValue,
  );
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = options.filter((option) =>
    String(get(option, labelKey))
      .toLowerCase()
      .includes(String(searchValue).toLowerCase()),
  );

  const selectedOption = options.find(
    (option) =>
      String(get(option, valueKey)) === String(get(selectedValue, valueKey)),
  );

  return (
    <FormControl
      name={name}
      label={displayLabel}
      error={error}
      description={displayDescription}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              selectVariants({ variant, size }),
              "w-[200px] justify-between",
            )}
          >
            {selectedOption ? (
              <span>{String(get(selectedOption, labelKey))}</span>
            ) : (
              <span>{placeholder}</span>
            )}
            <Icon
              icon={"lucide:chevrons-up-down"}
              className="ml-2 h-4 w-4 shrink-0 opacity-50"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              onValueChange={(value) => setSearchValue(value)}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option, index) => {
                  return (
                    <CommandItem
                      key={index}
                      value={String(get(option, labelKey))}
                      onSelect={() => {
                        setSelectedValue(
                          get(option, valueKey) === get(selectedValue, valueKey)
                            ? undefined
                            : option,
                        );
                        onSelect(
                          get(option, valueKey) === get(selectedValue, valueKey)
                            ? undefined
                            : option,
                        );
                        setOpen(false);
                        setSearchValue("");
                      }}
                    >
                      <Icon
                        icon="lucide:check"
                        className={`mr-2 h-4 w-4 text-basic ${
                          String(get(selectedValue, valueKey)) ===
                          String(get(option, valueKey))
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {String(get(option, labelKey))}
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
