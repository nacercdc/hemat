import type { ComponentPropsWithoutRef } from "react";
import { Checkbox as NWCheckbox } from "../../../nativewindui/components/checkbox/Checkbox";
import { FormController } from "../helper/FormController";
import { Text } from "../../../nativewindui/components/text/Text";
import { TouchableOpacity } from "react-native";
import { omit } from "@e-market/utilities";
import { cn } from "../../../nativewindui/lib/cn.util";
interface Props
  extends Omit<
    ComponentPropsWithoutRef<typeof NWCheckbox>,
    "className" | "style"
  > {
  caption?: string;
  errorMessage?: string;
  label?: string;
}
export const Checkbox = ({
  caption,
  errorMessage,
  label,
  checked,
  onCheckedChange,
  ...props
}: Props) => {
  return (
    <FormController errorMessage={errorMessage} caption={caption}>
      <TouchableOpacity
        disabled={props.disabled}
        onPress={() => onCheckedChange?.(!checked)}
        activeOpacity={1}
        className="flex flex-row items-center gap-2"
      >
        <NWCheckbox
          checked={checked}
          onCheckedChange={() => onCheckedChange?.(!checked)}
          {...omit(
            props as ComponentPropsWithoutRef<typeof NWCheckbox>,
            "className",
            "style"
          )}
        />
        {label && (
          <Text
            className={cn("text-sm text-foreground", {
              "text-muted-foreground": props.disabled,
            })}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </FormController>
  );
};
