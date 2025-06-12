"use client";
import * as React from "react";
import { Icon } from "@iconify/react";
import get from "lodash.get";

import type { VariantProps } from "class-variance-authority";
import type { Props as SelectProps } from "../select";
import { selectVariants } from "../select";
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
import { Badge, Spinner } from "../../presentation";
import { useState } from "react";
import { Checkbox } from "../checkbox/Checkbox";

export interface Props<T>
  extends Omit<SelectProps<T>, "defaultValue" | "onSelect">,
    VariantProps<typeof selectVariants> {
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
  size,
  variant,
  labelVariant,
  labelSize,
  placeholder = "Select language",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  onOpenChange,
  onSelect,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  const isItemSelected = (item: T) =>
    values?.some(
      (selected: T) => get(selected, valueKey) === get(item, valueKey)
    );

  const onSelectHandler = (item: T) => {
    const newValue = isItemSelected(item)
      ? values?.filter(
          (selected: T) => get(selected, valueKey) !== get(item, valueKey)
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

  const handleChipRemove = (itemToRemove: T) => {
    console.log(itemToRemove, "REmoeosm");
    const newValue = values?.filter(
      (selected: T) => get(selected, valueKey) !== get(itemToRemove, valueKey)
    );
    onSelect(newValue);
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
      <Popover open={open} onOpenChange={onOpenChangeHandler}>
        <PopoverTrigger asChild className="flex items-center w-full">
          <Button
            variant="outline"
            className={cn(
              selectVariants({ variant, size }),
              "flex flex-grow-0 max-w-full overflow-x-auto p-1",
              error
                ? "border-destructive-500 focus:ring-destructive-500"
                : "border-basic-300"
            )}
          >
            <div
              className={cn(
                "mr-1 flex flex-1 items-center self-start overflow-x-auto ",
                values?.length === 0 && "text-basic-400"
              )}
            >
              {leftNode && leftNode}
              {Array.isArray(values) && values.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap ">
                  {values.map((item: T) => (
                    <span key={String(get(item, valueKey))}>
                      <Badge
                        variant="outlined"
                        shape="circular"
                        text={String(get(item, labelKey))}
                        icon={
                          <Icon
                            icon={"lucide:x"}
                            className="h-3 w-3 text-dark-light"
                          />
                        }
                        onAction={() => handleChipRemove(item)}
                      />
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-dark-light text-sm">
                  {placeholder ?? "Select options"}
                </span>
              )}
            </div>
            <Icon
              icon={"lucide:chevron-down"}
              className="z-50 h-4 w-4 shrink-0 opacity-100"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="min-w-full p-0">
          <ScrollArea>
            <Command>
              <div className="flex flex-col items-start gap-1 px-3 pt-2">
                <span className="text-sm text-dark">{placeholder}</span>
                <span className="text-xs text-dark-light">
                  {searchPlaceholder}
                </span>
              </div>
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
                        className="flex flex-row items-center justify-between w-full min-h-10 bg-card border-[1px] border-dark-lighter mb-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span>{String(get(item, labelKey))}</span>
                          <span className="flex right-2 absolute">
                            <Checkbox
                              checked={isItemSelected(item)}
                              onCheckedChange={() => onSelectHandler(item)}
                            />
                          </span>
                        </div>
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
