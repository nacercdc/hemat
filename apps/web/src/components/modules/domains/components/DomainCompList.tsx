"use client";

import React from "react";
import { ListTypeColors } from "./DomainCompCard";
import { DomainCompListItem } from "./DomainCompListItem";
import type { ListItemType, ListType, ListTypeLabel } from "..";

interface Props {
  list: ListType;
  listType: ListTypeLabel;
  selectedItem: string | null;
  onSelectItem?: (item: string) => void;
  refetchList?: (type: ListTypeLabel) => void;
}

export function DomainCompList({
  list,
  listType,
  selectedItem,
  onSelectItem,
  refetchList,
}: Props) {
  const isItemSelected = (item: ListItemType) => {
    if (selectedItem) return item?.id === selectedItem;
  };

  return (
    <div className="flex flex-col gap-5">
      {list?.map((listItem) => (
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
            refetchList={refetchList}
          />
        </div>
      ))}
    </div>
  );
}
