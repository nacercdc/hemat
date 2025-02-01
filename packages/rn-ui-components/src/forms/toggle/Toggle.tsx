import type { ToggleProps } from "@ui-kitten/components";
import { Toggle as UKToggle } from "@ui-kitten/components";
import { omit } from "@e-market/utilities";

interface Props extends Omit<ToggleProps, "className" | "style"> {
  status?:
    | "basic"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "control";
}
export default function Toggle(props: Props) {
  return <UKToggle {...omit(props as ToggleProps, "className", "style")} />;
}
