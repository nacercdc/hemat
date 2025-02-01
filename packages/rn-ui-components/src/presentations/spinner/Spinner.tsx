import type { SpinnerProps } from "@ui-kitten/components";
import { Spinner as RnSpinner } from "@ui-kitten/components";
import { omit } from "@e-market/utilities";

interface Props extends Omit<SpinnerProps, "className" | "style"> {
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
export const Spinner=(props: Props) =>{
  return <RnSpinner {...omit(props as SpinnerProps, "className", "style")} />;
}
