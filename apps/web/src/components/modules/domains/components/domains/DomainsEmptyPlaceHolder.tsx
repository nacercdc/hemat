"use client";

import React from "react";
import { Icon } from "@iconify/react";

export function DomainsEmptyPlaceHolder() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-basic-100 flex items-center justify-center">
          <Icon
            icon="mdi:file-document-outline"
            className="w-8 h-8 text-basic-400"
          />
        </div>
        <h3 className="text-lg font-medium text-basic mb-2">No Domains</h3>
        <p className="text-basic-500 text-sm">
          There are no domains available.
        </p>
      </div>
    </div>
  );
}
