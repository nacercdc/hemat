import type { ComponentPropsWithoutRef } from "react";
import type { Checkbox } from "../../../nativewindui/components/checkbox/Checkbox";

export interface CheckboxGroupOption<Entity>
  extends Pick<ComponentPropsWithoutRef<typeof Checkbox>, "disabled"> {
  entity: Entity | string | boolean;
}
