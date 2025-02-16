import type { ComponentProps } from "react";
import React from "react";
import { Text as NWText } from "../../../nativewindui/components/text/Text";
interface Props extends ComponentProps<typeof NWText> {
  className?: string;
}

export const Text = (props: Props) => {
  return <NWText {...props} />;
};
