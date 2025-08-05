"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Tooltip } from "@etm/web-ui-components";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";

interface IScaleDescription {
  id: string;
  measurementScaleId: string;
  description: string;
  translations: Record<string, { description: string }>;
}

interface Props {
  id: string;
  subComponentId: string;
  scale: number;
  color: string;
  label: string;
}

export function MeasurementScaleCard({
  id,
  subComponentId,
  scale,
  color,
  label,
}: Props) {
  const [scaleHovered, setScaleHovered] = useState(false);

  const { data: scaleDescription, ...scaleDescriptionState } =
    useFindById<IScaleDescription>({
      path: `/dashboard/template/subcomponents/${subComponentId}/measurement-scale/${id}`,
      isProtected: false,
      tqOptions: { enabled: scaleHovered },
    });

  const isLoading =
    scaleDescriptionState.isLoading || scaleDescriptionState.isFetching;

  const onScaleDescHoverHandler = () => {
    if (!isLoading) setScaleHovered(true);
  };

  const onScaleDescMouseLeaveHandler = () => {
    setScaleHovered(false);
  };

  return (
    <div
      className="flex items-center gap-3 justify-between border-l-[1.5px] p-2.5 rounded-sm"
      style={{
        borderColor: `${color}`,
        backgroundColor: `${color}20`,
      }}
    >
      <div className="flex items-center gap-1 text-xs">
        <span>{label}</span>
        <span>{`(${scale})`}</span>
      </div>
      <Tooltip
        color="dark"
        content={scaleDescription?.description}
        contentLoading={isLoading}
        trigger={
          <Icon
            icon="material-symbols:info-outline-rounded"
            className="w-4 h-4"
            onMouseEnter={onScaleDescHoverHandler}
            onMouseLeave={onScaleDescMouseLeaveHandler}
          />
        }
      />
    </div>
  );
}
