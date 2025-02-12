import type { Picker } from "@react-native-picker/picker";
import type { ComponentPropsWithoutRef } from "react";

export interface PickerOption<Entity>
  extends Pick<ComponentPropsWithoutRef<typeof Picker>, "enabled"> {
  entity: Entity;
}
