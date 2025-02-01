import { Text, View } from "@e-market/rn-ui-components";
import React from "react";

interface Props {
  text: string;
  isRequired?: boolean;
  disabled?: boolean;
}
export const Label = ({ text, isRequired }: Props) => {
  return (
    <View className="flex flex-row gap-1">
      {text && <Text category="label">{text}</Text>}
      {isRequired && <Text status="danger">*</Text>}
    </View>
  );
};
