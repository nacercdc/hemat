"use client";

import React from "react";
import { Icon } from "@iconify/react";
import type { ListTypeLabel } from "..";

interface Props {
  listType: ListTypeLabel;
  parentId?: string | null;
}

export function DomainCompEmptyPlaceHolder({ listType, parentId }: Props) {
  const shouldShowNoSelectionMessage = listType !== "Domain" && !parentId;

  const getIconName = () => {
    return shouldShowNoSelectionMessage
      ? "mdi:cursor-default-click"
      : "mdi:file-document-outline";
  };

  const getTitle = () => {
    return shouldShowNoSelectionMessage
      ? `No ${listType === "Component" ? "domain" : "component"} selected`
      : `No ${listType} found`;
  };

  const getDescription = () => {
    if (shouldShowNoSelectionMessage) {
      return `Please select a ${listType === "Component" ? "domain" : "component"} to view available ${listType.toLowerCase()}s.`;
    }

    if (listType === "Domain") {
      return "There are no domains available.";
    }

    return `There are no ${listType.toLowerCase()}s available for the selected ${
      listType === "Component" ? "domain" : "component"
    }.`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-basic-100 flex items-center justify-center">
          <Icon icon={getIconName()} className="w-8 h-8 text-basic-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{getTitle()}</h3>
        <p className="text-gray-500 text-sm">{getDescription()}</p>
      </div>
    </div>
  );
}
