"use client";

import React from "react";
import { DomainCompListItem } from "./DomainCompListItem";

import type { ItemDetailType, ListItemType, ListType, ListTypeLabel } from "..";
import { ListTypeColors } from "./DomainCompCard";

interface Props {
  list: ListType;
  listType: ListTypeLabel;
  selectedItem: ListItemType | null;
  onSelectItem?: (item: ListItemType) => void;
  getItemDetails?: (item: ListItemType) => Partial<ItemDetailType>;
}

export function DomainCompList({
  list,
  listType,
  selectedItem,
  onSelectItem,
  getItemDetails,
}: Props) {
  const isItemSelected = (item: ListItemType) => {
    if (selectedItem) return item.id === selectedItem.id;
  };

  return (
    <div className="flex flex-col gap-5">
      {list.map((listItem) => (
        <div
          key={listItem.id}
          className="rounded-lg"
          style={{
            backgroundColor: isItemSelected(listItem)
              ? `${ListTypeColors[listType]}`
              : "",
          }}
        >
          <DomainCompListItem
            item={listItem}
            type={listType}
            onClick={onSelectItem}
            getDetails={getItemDetails}
          />
        </div>
      ))}
    </div>
  );
}
