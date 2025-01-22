import React from "react";
import type { ViewProps } from "react-native";
import { View as RnView } from "react-native";

type Props = ViewProps;
export default function View(props: Props) {
  return <RnView {...props} />;
}
