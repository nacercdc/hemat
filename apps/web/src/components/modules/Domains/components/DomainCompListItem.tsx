"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button, DropdownMenu } from "@etm/web-ui-components";

import type { ListItemType } from "./DomainCompCard";

interface Props {
  item: ListItemType;
  onClick?: (item: ListItemType) => void;
}

export function DomainCompListItem({ item, onClick }: Props) {
  return (
    <div className="w-full flex items-center gap-5 rounded-lg border px-3 py-2">
      <DropdownMenu
        triggerTextAlign="center"
        align="center"
        trigger={
          <Icon
            icon="ph:dots-three-outline-fill"
            className="!w-4 !h-4 !text-dark rotate-90"
            onClick={(e) => e.stopPropagation()}
          />
        }
        options={[
          {
            value: "view",
            label: "View",
            leftNode: (
              <Icon icon="solar:eye-outline" className="!text-dark !w-4 !h-4" />
            ),
            onClick: () => {
              console.log("View Item Clicked");
            },
          },
          {
            value: "edit",
            label: "Edit",
            leftNode: (
              <Icon
                icon="iconamoon:edit-light"
                className="!text-dark !w-4 !h-4"
              />
            ),
            onClick: () => console.log("Edit Item Clicked"),
          },
          {
            value: "delete",
            label: "Delete",
            leftNode: (
              <Icon
                icon="material-symbols-light:delete-outline"
                className="!text-dark !w-4 !h-4"
              />
            ),
            onClick: () => console.log("Delete Item Clicked"),
          },
        ]}
      />
      <div
        className="flex items-center justify-between w-full gap-5 cursor-pointer"
        onClick={() => onClick?.(item)}
      >
        <h5 className="text-sm font-medium">{item.name}</h5>
        <Button type="button" variant="ghost">
          <Icon
            icon="ion:chevron-back-outline"
            className="!w-4 !h-4 !text-dark rotate-180"
          />
        </Button>
      </div>
    </div>
  );
}
