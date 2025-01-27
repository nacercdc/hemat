import type { ButtonProps } from "@ui-kitten/components";
import { Button as UKButton } from "@ui-kitten/components";
import { omit } from "~/utils/object";
interface Props extends Omit<ButtonProps, "className" | "style"> {
  appearance?: "filled" | "outline" | "ghost";
  size?: "tiny" | "small" | "medium" | "large" | "giant";
  status?:
    | "basic"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "link"
    | "control";
}
export default function Button(props: Props) {
  return <UKButton {...omit(props as ButtonProps, "className", "style")} />;
}
