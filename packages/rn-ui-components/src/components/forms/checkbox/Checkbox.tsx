import type { ComponentPropsWithoutRef } from "react";
import { Checkbox as NWCheckbox } from "../../../nativewindui/components/checkbox/Checkbox";
import { FormController } from "../helper/FormController";
import { Text } from "../../../nativewindui/components/text/Text";
import { TouchableOpacity } from "react-native";
import { omit } from "@e-market/utilities";

interface Props
  extends Omit<
    ComponentPropsWithoutRef<typeof NWCheckbox>,
    "onCheckedChange" | "className" | "style"
  > {
  caption?: string;
  errorMessage?: string;
  label?: string;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({
  caption,
  errorMessage,
  label,
  checked = false,
  onChange,
  ...props
}: Props) => {
  const handlePress = () => {
    onChange?.(!checked);
  };

  return (
    <FormController errorMessage={errorMessage} caption={caption}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={1}
        className="flex flex-row items-center gap-2"
      >
        <NWCheckbox
          checked={checked}
          onCheckedChange={handlePress}
          {...omit(
            props as ComponentPropsWithoutRef<typeof NWCheckbox>,
            "onCheckedChange",
            "className",
            "style"
          )}
        />
        {label && <Text className="text-sm text-foreground">{label}</Text>}
      </TouchableOpacity>
    </FormController>
  );
};
