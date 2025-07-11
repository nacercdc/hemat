"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "~/utils/cn.util";
import { ComponentsListSkeleton } from "./ComponentsListSkeleton";
import { TruncatedText } from "~/components/ui/TruncatedText";
import type { SubComponent } from "~/libs/models/subComponent.model";
import type { Component as ComponentModel } from "~/libs/models/component.model";
import { Badge, Skeleton } from "@etm/web-ui-components";

export interface Component extends ComponentModel {
  subComponents: SubComponent[];
}

interface Props {
  components?: Component[];
  numberOfFilledSubs: number;
  numberOfSubs: number;
  statusLoading: boolean;
  isLoading?: boolean;
  onClick: (id: string) => void;
}

export function ComponentsList({
  components,
  numberOfFilledSubs,
  numberOfSubs,
  statusLoading,
  isLoading = false,
  onClick,
}: Props) {
  const [activeComponent, setActiveComponent] = useState<Component>();

  const onComponentClickHandler = (component: Component) => {
    setActiveComponent(component);
    onClick(component.id);
  };

  useEffect(() => {
    if (components?.length && !activeComponent) {
      setActiveComponent(components?.[0]);
    }
  }, [activeComponent, components]);

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
          <div className="absolute -top-3 -right-0 rounded-full text-white">
            {!statusLoading && (
              <Badge
                text={
                  <span className="text-[9px]">{`${numberOfFilledSubs} / ${numberOfSubs}`}</span>
                }
                shape="circular"
                variant="light"
              />
            )}
            {statusLoading && <Skeleton className="w-10 h-6 rounded-full" />}
          </div>
        </div>
      ))}
    </div>
  );
}
