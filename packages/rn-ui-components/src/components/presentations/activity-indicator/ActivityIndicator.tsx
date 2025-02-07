import type { ComponentProps } from "react";
import React from "react";
import { ActivityIndicator as NWActivityIndicator } from "../../../nativewindui/components/activity-indicator/ActivityIndicator";
type Props = ComponentProps<typeof NWActivityIndicator>;

export const ActivityIndicator = (props: Props) => {
  return <NWActivityIndicator {...props} />;
};
