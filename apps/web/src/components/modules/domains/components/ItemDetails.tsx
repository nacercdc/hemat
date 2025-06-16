import React from "react";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import type { ListItemType, ListTypeLabel } from "..";
import type { Domain } from "~/libs/models/domain.model";
import type { Component } from "~/libs/models/component.model";
import type { SubComponent } from "~/libs/models/subComponent.model";

interface Props {
  itemId: string;
  type: ListTypeLabel;
  isOpen: boolean;
}

const ItemDetails = ({ itemId, type, isOpen = false }: Props) => {
  console.log(isOpen, itemId, type);
  const { data: domain } = useFindById<Domain>({
    path: `/domains/${itemId}`,
    tqOptions: {
      enabled: !!isOpen,
      queryKey: ["Domain", itemId],
    },
  });

  const { data: component } = useFindById<Component>({
    path: `/components/${itemId}`,
    tqOptions: {
      enabled: !!isOpen,
      queryKey: ["Component", itemId],
    },
  });

  const { data: subComponent } = useFindById<SubComponent>({
    path: `/sub-components/${itemId}`,
    tqOptions: {
      enabled: !!isOpen,
      queryKey: ["SubComponent", itemId],
    },
  });

  const item: ListItemType | undefined = domain || component || subComponent;

  if (!item) return null;

  return (
    <div className="border-[1px] rounded-md p-5 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-info/10 text-info p-2 px-3 text-xs">
          Code: {item.code}
        </div>
        <h3 className="text-sm font-bold">{item.name}</h3>
      </div>
      <span className="text-xs">{item.description}</span>
      {item.componentsCount !== undefined && (
        <h6 className="text-xs font-medium">
          Components: {item.componentsCount}
        </h6>
      )}
      {item.subComponentsCount !== undefined && (
        <h6 className="text-xs font-medium">
          Sub-Components: {item.subComponentsCount}
        </h6>
      )}
    </div>
  );
};

export default ItemDetails;
