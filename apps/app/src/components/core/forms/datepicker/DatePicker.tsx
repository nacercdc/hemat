import React from "react";
import type { DatepickerProps } from "@ui-kitten/components";
import { Layout, Datepicker as UKDatePicker } from "@ui-kitten/components";
import { omit } from "~/utils/object";
interface Props
  extends Omit<
    DatepickerProps,
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
  placement?:
    | "left"
    | "top"
    | "right"
    | "bottom"
    | "left start"
    | "left end"
    | "top start"
    | "top end"
    | "right start"
    | "right end"
    | "bottom start"
    | "bottom end";
}
export default function DatePicker(props: Props) {
  return (
    <Layout style={{ width: "100%" }}>
      <UKDatePicker
        {...omit(
          props as DatepickerProps,
          "className",
          "style",
          "controlStyle",
          "backdropStyle"
        )}
      />
    </Layout>
  );
}
