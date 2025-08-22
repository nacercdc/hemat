"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "~/utils/cn.util";
import { ComponentsListSkeleton } from "./ComponentsListSkeleton";
import { TruncatedText } from "~/components/ui/TruncatedText";
import { Badge, Skeleton } from "@etm/web-ui-components";
import type { SubComponent } from "~/libs/models/subComponent.model";
import type { Component as ComponentModel } from "~/libs/models/component.model";
import type { FilledSubComponent } from "../..";

export interface Component extends ComponentModel {
  subComponents: SubComponent[];
}

interface Props {
  components?: Component[];
  activeComponent?: Component;
  filledSubs: FilledSubComponent[];
  numberOfSubs: number;
  statusLoading: boolean;
  isLoading?: boolean;
  onClick: (id: string) => void;
}

export function ComponentsList({
  components,
  filledSubs,
  numberOfSubs,
  statusLoading,
  isLoading = false,
  activeComponent,
  onClick,
}: Props) {
  const onComponentClickHandler = (component: Component) => {
    onClick(component.id);
  };

  const numOfFilledSub = useMemo(
    () => filledSubs?.filter((sub) => sub.filled),
    [filledSubs]
  );

  if (isLoading) return <ComponentsListSkeleton />;

  return (
    <div className="flex flex-ros lg:flex-col gap-1 lg:gap-3 w-full overflow-auto lg:max-h-[746px] lg:overflow-y-auto ">
      {components?.map((component) => (
        <div
          key={component.id}
          onClick={() => onComponentClickHandler(component)}
          className={cn(
            "flex items-center justify-between p-4 rounded-xl h-14 border border-basic-300 cursor-pointer w-full relative mt-3",
            activeComponent?.id === component.id && "bg-layout-bg"
          )}
        >
          <span className="text-sm font-medium flex-1 text-nowrap">
            <TruncatedText
              text={component.name}
              maxLength={25}
              toolTipVariant="dark"
            />
          </span>
          <Icon
            icon="ion:chevron-forward-outline"
            className="w-4 h-4 hidden lg:block"
          />
          {activeComponent?.id === component.id && (
            <div className="absolute -top-3 -right-0 rounded-full text-white">
              {!statusLoading && (
                <Badge
                  text={
                    <span className="text-[9px]">{`${numOfFilledSub?.length || 0} / ${numberOfSubs}`}</span>
                  }
                  shape="circular"
                  variant="light"
                />
              )}
              {statusLoading && <Skeleton className="w-10 h-6 rounded-full" />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
