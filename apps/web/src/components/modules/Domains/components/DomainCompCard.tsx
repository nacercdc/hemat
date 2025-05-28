"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@etm/web-ui-components";
import { DomainsList } from "./DomainCompList";
import type { Component, Domain, SubComponent } from "..";
import { cn } from "~/utils/cn.util";

export type CardType = "Domain" | "Component" | "Sub-Component";
export type ListType = Domain[] | Component[] | SubComponent[];
export type ListItemType = Domain | Component | SubComponent;

const CardTypeColorMapper: Record<CardType, string> = {
  Domain: "#edf4fb",
  Component: "#e9ebfb",
  "Sub-Component": "#f9f5f0",
};

interface Props {
  cardType: CardType;
  list: ListType;
  selectedListItem: ListItemType | null;
  actionDisabled?: boolean;
  onAddActionHandler: () => void;
  onListItemSelectHandler?: (listItem: ListItemType) => void;
}

export function DomainCompCard({
  cardType,
  list,
  selectedListItem,
  actionDisabled = true,
  onAddActionHandler,
  onListItemSelectHandler,
}: Props) {
  return (
    <div className="h-full w-full flex flex-col bg-tbaccent">
      <div
        className="flex justify-between items-center px-4 py-2"
        style={{ backgroundColor: `${CardTypeColorMapper[cardType]}` }}
      >
        <h1 className="text-[1rem] font-bold">{cardType}</h1>
        <Button
          type="button"
          variant="ghost"
          onClick={onAddActionHandler}
          disabled={actionDisabled}
        >
          <Icon icon="tabler:plus" className={cn("!w-6 !h-6")} />
        </Button>
      </div>
      <div className="px-4 my-5">
        {
          <DomainsList
            list={list}
            selectedItem={selectedListItem}
            onSelectItem={onListItemSelectHandler}
          />
        }
      </div>
    </div>
  );
}
