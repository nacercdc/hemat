"use client";

import React from "react";
import type { DefaultFieldsFormData } from "./DefaultFieldsForm";
import { DefaultFieldsForm } from "./DefaultFieldsForm";
import type { ScalesFormData } from "./ScalesForm";
import { ScalesForm } from "./ScalesForm";
import type {
  SubComponent,
  SubComponentIncludable,
} from "~/libs/models/subComponent.model";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";

interface Props {
  scalesLoading?: boolean;
  onCloseModal?: () => void;
  subComponent?: SubComponent;
  defaultFieldsLoading?: boolean;
  onScalesSubmit: (data: ScalesFormData) => void;
  onDefaultFieldsSubmit: (data: DefaultFieldsFormData) => void;
}

export function SubComponentForm({
  subComponent,
  onCloseModal,
  scalesLoading,
  onScalesSubmit,
  defaultFieldsLoading,
  onDefaultFieldsSubmit,
}: Props) {
  const { data: subComponentDetail, ..._subComponentState } = useFindById<
    SubComponent,
    SubComponentIncludable
  >({
    path: `sub-components/${subComponent?.id}`,
    queries: {
      include: ["measurementScales"],
    },
    tqOptions: {
      enabled: !!subComponent,
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full max-h-[700px] overflow-y-auto">
      <DefaultFieldsForm
        loading={defaultFieldsLoading}
        item={subComponentDetail}
        onCloseModal={onCloseModal}
        onSubmit={onDefaultFieldsSubmit}
      />
      <ScalesForm
        loading={scalesLoading}
        item={subComponentDetail}
        onSubmit={onScalesSubmit}
        onCloseModal={onCloseModal}
      />
    </div>
  );
}
