"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Tooltip } from "@etm/web-ui-components";
import { ScalesMap } from "../assessment-detail-section/DomainCard";

interface Props {
  scale: number;
}

export function MeasurementScaleCard({ scale }: Props) {
  return (
    <div
      className="flex items-center gap-3 justify-between border-l-[1.5px] p-2.5 rounded-sm"
      style={{
        borderColor: `${ScalesMap[scale]?.color}`,
        backgroundColor: `${ScalesMap[scale]?.color}20`,
      }}
    >
      <div className="flex items-center gap-1 text-xs">
        <span>{ScalesMap[scale]?.label}</span>
        <span>{`(${scale})`}</span>
      </div>
      <Tooltip
        color="dark"
        content="measurement scale description goes here ..."
        trigger={
          <Icon
            icon="material-symbols:info-outline-rounded"
            className="w-4 h-4"
          />
        }
      />
    </div>
  );
}
