import type { CircularProgressBarProps } from "@ui-kitten/components";
import { ProgressBar as UKProgressBar } from "@ui-kitten/components";
import { omit } from "@e-market/utilities";

interface Props
  extends Omit<
    CircularProgressBarProps,
    "className" | "iconStyle" | "textStyle"
  > {
  size?: "tiny" | "small" | "medium" | "large" | "giant";
  status?:
    | "basic"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "control";
}
export const ProgressBar=(props: Props) =>{
  return (
    <UKProgressBar
      {...omit(
        props as CircularProgressBarProps,
        "className",
        "iconStyle",
        "textStyle"
      )}
    />
  );
}
