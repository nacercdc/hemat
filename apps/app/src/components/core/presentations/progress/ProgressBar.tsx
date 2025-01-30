import type { CircularProgressBarProps } from "@ui-kitten/components";
import { ProgressBar as UKProgressBar } from "@ui-kitten/components";
import { omit } from "~/utils/object";
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
export default function ProgressBar(props: Props) {
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
