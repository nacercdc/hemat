import type { Domain } from "~/libs/models/domain.model";

import type { Component } from "~/libs/models/component.model";
import type { SubComponent } from "~/libs/models/subComponent.model";

export type ListTypeLabel = "Domain" | "Component" | "SubComponent";

export type ItemDetailType = Record<
  "componentCount" | "subComponentCount",
  number
>;

export type ListType = Domain[] | Component[] | SubComponent[] | [];

export type ListItemType = (Domain | Component | SubComponent | null) & {
  componentsCount?: number;
  subComponentsCount?: number;
};
