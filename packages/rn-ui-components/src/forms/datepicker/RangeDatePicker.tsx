import React from "react";
import type { RangeDatepickerProps } from "@ui-kitten/components";
import {
  Layout,
  RangeDatepicker as UKRangeDatepicker,
} from "@ui-kitten/components";
import { omit } from "@e-market/utilities";
interface Props
  extends Omit<
    RangeDatepickerProps,
    "className" | "style" | "controlStyle" | "backdropStyle"
  > {
  status?:
    | "basic"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "control";
  size?: "small" | "medium" | "large";
}
export default function RangeDatepicker(props: Props) {
  return (
    <Layout style={{ width: "100%" }}>
      <UKRangeDatepicker
        {...omit(
          props as RangeDatepickerProps,
          "className",
          "style",
          "controlStyle",
          "backdropStyle"
        )}
      />
    </Layout>
  );
}
