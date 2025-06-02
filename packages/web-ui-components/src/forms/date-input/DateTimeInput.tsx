import * as React from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";

import { cn } from "../../shadcn-ui/utils/cn";
import { Button } from "../../shadcn-ui/button";
import { Input } from "../../shadcn-ui/input";
import { Calendar } from "../../shadcn-ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn-ui/popover";
import type { FormControlVariants } from "../form-control";
import { FormControl } from "../form-control";
import { Icon } from "@iconify/react/dist/iconify.js";

type SizeType = "sm" | "md" | "lg" | "xl";

const SizeClasses: Record<SizeType, string> = {
  sm: "px-2 h-10",
  md: "px-3 h-11",
  lg: "px-4 h-10",
  xl: "px-4 h-12",
};

export interface DateTimePickerProps {
  name: string;
  label?: string;
  error?: string;
  description?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  showTime?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  size?: SizeType;
  iconDirection?: "left" | "right";
  labelVariant?: FormControlVariants["variant"];
  labelSize?: FormControlVariants["size"];
}

export const DateTimePicker = ({
  name,
  label,
  error,
  description,
  value,
  onChange,
  showTime = true,
  disabled,
  required,
  placeholder = "Pick a date",
  size = "md",
  iconDirection = "left",
  labelVariant,
  labelSize,
}: DateTimePickerProps) => {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const ButtonIcon = <Icon icon="clarity:date-outline-badged" width={18} height={18} className="text-primary"/>

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (date) {
        newDate.setHours(date.getHours(), date.getMinutes());
      }
      setDate(newDate);
      onChange?.(newDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;

    if (date && timeValue) {
      const timeArray = timeValue.split(":");
      if (timeArray.length === 2) {
        const hours = parseInt(timeArray[0] ?? "");
        const minutes = parseInt(timeArray[1] ?? "");

        if (!isNaN(hours) && !isNaN(minutes)) {
          const newDate = new Date(date);
          newDate.setHours(hours, minutes);
          setDate(newDate);
          onChange?.(newDate);
        }
      }
    }
  };

  return (
    <FormControl
      name={name}
      label={label}
      error={error}
      description={description}
      variant={labelVariant}
      size={labelSize}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-card",
              iconDirection === "right" && "justify-between",
              !date && "text-muted-foreground",
              error && "border-destructive focus:ring-destructive",
              SizeClasses[size]
            )}
            disabled={disabled}
          >
            {iconDirection === "left" && ButtonIcon}
            {date ? format(date, showTime ? "PPP HH:mm" : "PPP") : placeholder}
            {iconDirection === "right" && ButtonIcon}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={disabled}
            initialFocus
          />
          {showTime && (
            <div className="border-t p-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={date ? format(date, "HH:mm") : ""}
                onChange={handleTimeChange}
                disabled={disabled}
                required={required}
                className={cn(
                  error && "border-destructive focus:ring-destructive"
                )}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </FormControl>
  );
};
