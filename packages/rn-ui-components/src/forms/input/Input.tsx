import React from "react";
import type { InputProps } from "@ui-kitten/components";
import { Input as UKInput } from "@ui-kitten/components";
import { omit } from "@e-market/utilities";

interface Props extends Omit<InputProps, "className" | "style" | "textStyle"> {
  size?: "small" | "medium" | "large";
  status?:
    | "basic"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "control";
}
export default function Input(props: Props) {
  return (
    <UKInput
      {...omit(props as InputProps, "className", "style", "textStyle")}
    />
  );
}
