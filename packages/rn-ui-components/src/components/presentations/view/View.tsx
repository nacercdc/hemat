import React from "react";
import type { ViewProps } from "react-native";
import { View as RnView } from "react-native";

interface Props extends ViewProps {
  className?: string;
}
export const View = (props: Props) => {
  return <RnView {...props} />;
};
