import * as React from "react";
import { Icon } from "@iconify/react";
import get from "lodash.get";

import type { Props as SelectProps } from "../select";
import {
  Button,
  Command,
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
  searchPlaceholder,
  values,
  error,
  onSelect,
}: Props<T>) {
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

  return (
    <FormControl
      name={name}
      label={displayLabel}
      error={error}
      description={displayDescription}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "relative flex w-[300px] flex-wrap overflow-hidden border",
              error
                ? "border-destructive-500 focus:ring-destructive-500"
                : "border-basic-300"
            )}
          >
            <div
              className={cn(
                "mr-1 flex flex-1 self-start overflow-hidden",
                values?.length === 0 && "text-gray-400"
              )}
            >
              {Array.isArray(values) && values.length > 0
                ? values
                    .map((item: T) => String(get(item, labelKey)))
                    .join(", ")
                : "Select options"}
            </div>
            <Icon
              icon={"lucide:chevrons-up-down"}
              className="z-50 h-4 w-4 shrink-0 opacity-100"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0">
          <ScrollArea>
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandGroup>
                  {options.map((item) => {
                    return (
                      <CommandItem
                        key={String(get(item, valueKey))}
                        onSelect={() => onSelectHandler(item)}
                      >
                        <Icon
                          icon="lucide:check"
                          className={cn(
                            "mr-2 h-4 w-4 text-basic",
                            isItemSelected(item) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {String(get(item, labelKey))}
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
