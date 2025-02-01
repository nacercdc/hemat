import type { SelectItemProps } from "@ui-kitten/components/ui/select/selectItem.component";

export interface SelectOption<Entity>
  extends Omit<SelectItemProps, "className" | "style" | "children" | "title"> {
  entity: Entity;
}
