"use client";

import React from "react";
import { ListTypeColors } from "./DomainCompCard";
import { DomainCompListItem } from "./DomainCompListItem";
import { DomainCompListSkeleton } from "./DomainCompListSkeleton";

import type { ListItemType, ListType, ListTypeLabel } from "..";
import { DomainCompEmptyPlaceHolder } from "./DomainCompEmptyPlaceHolder";

interface Props {
  list: ListType;
  isLoading?: boolean;
  listType: ListTypeLabel;
  parentId?: string | null;
  selectedItem: string | null;
  onSelectItem?: (item: string) => void;
  refetchList?: (type: ListTypeLabel) => void;
}

export function DomainCompList({
  list,
  isLoading,
  listType,
  parentId,
  refetchList,
  selectedItem,
  onSelectItem,
}: Props) {
  const isItemSelected = (item: ListItemType) => {
    if (selectedItem) return item?.id === selectedItem;
  };

  console.log(isLoading, "isLoading");

  if (isLoading && !list && !isLoading) {
    return <DomainCompListSkeleton />;
  }

  if (!list || list.length === 0) {
    return (
      <DomainCompEmptyPlaceHolder listType={listType} parentId={parentId} />
    );
  }

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
