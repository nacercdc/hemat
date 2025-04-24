"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { cn } from "../../shadcn-ui/utils/cn";
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
import type { Props as InputProps, InputVariantProps } from "./Input";
import { Input, inputVariants } from "./Input";
import { FormControl } from "../form-control";
import type { FormControlVariants } from "../form-control";
import { Spinner } from "../../presentation";
export type CountryCode = RPNInput.Country;
export interface CountryEntry {
  label: string;
  value: CountryCode;
}

export type Props = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref" | "className" | "style" | "size"
> &
  Omit<
    RPNInput.Props<typeof RPNInput.default>,
    "onChange" | "className" | "style" | "countries"
  > & {
    name: string;
    label?: string;
    labelVariant?: FormControlVariants["variant"];
    labelSize?: FormControlVariants["size"];
    error?: string;
    description?: string;
    size?: InputVariantProps["size"];
    variant?: InputVariantProps["variant"];
    options?: CountryEntry[];
    loading?: boolean;
    onChange?: (value: RPNInput.Value) => void;
  };

export const PhoneNumberInput: React.ForwardRefExoticComponent<Props> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, Props>(
    ({ onChange, options, loading, ...props }, ref) => {
      return (
        <FormControl
          name={props.name}
          label={props.label}
          error={props.error}
          variant={props.labelVariant}
          size={props.labelSize}
          description={props.description}
        >
          <RPNInput.default
            ref={ref}
            className={cn("flex")}
            flagComponent={FlagComponent}
            countries={options?.map((v) => v.value)}
            countrySelectComponent={({ ...csProps }: CountrySelectProps) => (
              <div className="relative">
                <CountrySelect
                  {...csProps}
                  options={options ?? []}
                  size={props.size}
                  error={props.error ?? ""}
                />

                {loading && (
                  <>
                    <span className="absolute inset-0 bg-basic-800 opacity-40 rounded-md" />

                    <span className="absolute inset-0 flex items-center justify-center">
                      <Spinner color="primary" size="sm" />
                    </span>
                  </>
                )}
              </div>
            )}
            inputComponent={InputComponent}
            smartCaret={false}
            defaultCountry="ET"
            onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
            {...props}
          />
        </FormControl>
      );
    }
  );

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.JSX.IntrinsicAttributes &
    InputProps &
    React.RefAttributes<HTMLInputElement>
>((props, ref) => {
  return <Input {...props} isPhone={true} ref={ref} />;
});

interface CountrySelectProps {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  size: InputVariantProps["size"];
  error: string;
  onChange: (country: RPNInput.Country) => void;
}

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  size,
  error,
  onChange,
}: CountrySelectProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            inputVariants({ size }),
            error && error && "border-destructive-500",
            "flex gap-1 rounded-e-none rounded-s-lg border-r-0 focus:z-10 text-lg w-fit"
          )}
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "-mr-2 size-4 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
}: CountrySelectOptionProps) => {
  return (
    <CommandItem className="gap-2" onSelect={() => onChange(country)}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
      />
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
