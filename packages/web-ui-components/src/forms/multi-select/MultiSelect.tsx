"use client";
import * as React from "react";
import { Icon } from "@iconify/react";
import get from "lodash.get";

import type { Props as SelectProps } from "../select";
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
  ScrollArea,
} from "../../shadcn-ui";
import { cn } from "../../shadcn-ui/utils/cn";
import { FormControl } from "../form-control";
import { Spinner } from "../../presentation";
import { useState } from "react";

export interface Props<T>
  extends Omit<SelectProps<T>, "defaultValue" | "onSelect"> {
  values?: T[];
  onSelect: (value?: T[]) => void;
}

export function MultiSelect<T>({
  name,
  displayLabel,
  displayDescription,
  options,
  valueKey,
  labelKey,
  values,
  error,
  loading,
  leftNode,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  onOpenChange,
  onSelect,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  const isItemSelected = (item: T) =>
    values?.some(
      (selected: T) => get(selected, valueKey) === get(item, valueKey),
    );

  const onSelectHandler = (item: T) => {
    const newValue = isItemSelected(item)
      ? values?.filter(
          (selected: T) => get(selected, valueKey) !== get(item, valueKey),
        )
      : [...(values ?? []), item];

    onSelect(newValue);
  };

  const onOpenChangeHandler = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      onOpenChange?.();
    }
  };
  return (
    <FormControl
      name={name}
      label={displayLabel}
      error={error}
      description={displayDescription}
    >
      <Popover open={open} onOpenChange={onOpenChangeHandler}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "relative flex flex-wrap overflow-hidden border",
              error
                ? "border-destructive-500 focus:ring-destructive-500"
                : "border-basic-300",
            )}
          >
            <div
              className={cn(
                "mr-1 flex flex-1 items-center self-start overflow-hidden",
                values?.length === 0 && "text-basic-400",
              )}
            >
              {leftNode && leftNode}
              {Array.isArray(values) && values.length > 0 ? (
                values.map((item: T) => String(get(item, labelKey))).join(", ")
              ) : (
                <span className="text-dark-light text-sm">
                  {placeholder ?? "Select options"}
                </span>
              )}
            </div>
            <Icon
              icon={"lucide:chevrons-up-down"}
              className="z-50 h-4 w-4 shrink-0 opacity-100"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-fit p-0">
          <ScrollArea>
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                {loading && (
                  <div className="flex items-center justify-center w-full h-36">
                    <Spinner color="primary" size="sm" />
                  </div>
                )}
                <CommandEmpty>{!loading && emptyText}</CommandEmpty>
                <CommandGroup className="w-full">
                  {options.map((item) => {
                    return (
                      <CommandItem
                        key={String(get(item, valueKey))}
                        onSelect={() => onSelectHandler(item)}
                        className="flex flex-row items-center justify-between w-full"
                      >
                        {String(get(item, labelKey))}
                        <Icon
                          icon="lucide:check"
                          className={cn(
                            "mr-2 h-4 w-4 text-basic",
                            isItemSelected(item) ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </FormControl>
  );
}
