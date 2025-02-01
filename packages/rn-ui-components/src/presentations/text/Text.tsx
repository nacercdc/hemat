import type { TextProps } from "@ui-kitten/components";
import { Text as UKText } from "@ui-kitten/components";
import React from "react";
import { omit } from "@e-market/utilities";

interface Props extends Omit<TextProps, "className" | "style"> {
  category?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "s1"
    | "s2"
    | "p1"
    | "p2"
    | "c1"
    | "c2"
    | "label";
  status?:
    | "basic"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "control";
}
export default function Text(props: Props) {
  return <UKText {...omit(props as TextProps, "className", "style")} />;
}
