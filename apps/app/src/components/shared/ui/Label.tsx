import React from "react";

import View from "~/components/core/presentations/view/View";
import Text from "~/components/core/presentations/text/Text";

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
