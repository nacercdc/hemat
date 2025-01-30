import type { ProgressBarProps } from "@ui-kitten/components";
import { CircularProgressBar as UKCircularProgressBar } from "@ui-kitten/components";
import { omit } from "~/utils/object";
interface Props extends Omit<ProgressBarProps, "className" | "style"> {
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
export default function CircularProgressBar(props: Props) {
  return (
    <UKCircularProgressBar
      {...omit(props as ProgressBarProps, "className", "style")}
    />
  );
}
