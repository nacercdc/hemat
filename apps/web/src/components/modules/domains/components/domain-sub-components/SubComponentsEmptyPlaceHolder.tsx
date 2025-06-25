"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useActiveList } from "../../providers/active-list/useActiveList";

export function SubComponentsEmptyPlaceHolder() {
  const { componentId } = useActiveList();
  return (
    <div className="flex flex-col h-full flex-1 items-center justify-center py-12 px-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-basic-100 flex items-center justify-center">
          <Icon
            icon={
              componentId
                ? "mdi:file-document-outline"
                : "mdi:cursor-default-click"
            }
            className="w-8 h-8 text-basic-400"
          />
        </div>
        <h3 className="text-lg font-medium text-basic mb-2">
          No Sub Components
        </h3>
        <p className="text-basic-500 text-sm">
          {componentId
            ? "There are no sub components available for this component."
            : "Please select a component to view available sub components."}
        </p>
      </div>
    </div>
  );
}
