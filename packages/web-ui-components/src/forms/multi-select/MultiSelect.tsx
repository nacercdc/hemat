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
  defaultValue?: T[] | undefined;
  onSelect: (value: T[] | undefined) => void;
}

export function MultiSelect<T>({
  name,
  displayLabel,
  displayDescription,
  options,
  valueKey,
  labelKey,
  searchPlaceholder,
  defaultValue,
  error,
  onSelect,
}: Props<T>) {
  const [selectedValues, setSelectedValues] = React.useState<T[] | undefined>(
    defaultValue,
  );

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
                : "border-basic-300",
            )}
          >
            <div
              className={cn(
                "mr-1 flex flex-1 self-start overflow-hidden",
                selectedValues?.length === 0 && "text-gray-400",
              )}
            >
              {Array.isArray(selectedValues) && selectedValues.length > 0
                ? selectedValues
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
                    const isSelected = selectedValues?.some(
                      (selected: T) =>
                        get(selected, valueKey) === get(item, valueKey),
                    );

                    return (
                      <CommandItem
                        key={String(get(item, valueKey))}
                        onSelect={() => {
                          const newValue = isSelected
                            ? selectedValues?.filter(
                                (selected: T) =>
                                  get(selected, valueKey) !==
                                  get(item, valueKey),
                              )
                            : [...(selectedValues ?? []), item];

                          setSelectedValues(newValue);
                          onSelect(newValue);
                        }}
                      >
                        <Icon
                          icon="lucide:check"
                          className={cn(
                            "mr-2 h-4 w-4 text-basic",
                            isSelected ? "opacity-100" : "opacity-0",
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
