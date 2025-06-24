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
import { useActiveList } from "../../../providers/active-list/useActiveList";

interface Props {
  loading?: boolean;
  item?: SubComponent;
  onCloseModal?: () => void;
  onScalesSubmit: (data: ScalesFormData) => void;
  onDefaultFieldsSubmit: (data: DefaultFieldsFormData) => void;
}

export function SubComponentForm({
  loading,
  onCloseModal,
  onScalesSubmit,
  onDefaultFieldsSubmit,
}: Props) {
  const { subComponentId } = useActiveList();
  const { data: subComponent, ..._subComponentState } = useFindById<
    SubComponent,
    SubComponentIncludable
  >({
    path: `sub-components/${subComponentId}`,
    queries: {
      include: ["measurementScales"],
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full max-h-[700px] overflow-y-auto">
      <DefaultFieldsForm
        loading={loading}
        item={subComponent}
        onCloseModal={onCloseModal}
        onSubmit={onDefaultFieldsSubmit}
      />
      <ScalesForm
        loading={loading}
        item={subComponent}
        onSubmit={onScalesSubmit}
        onCloseModal={onCloseModal}
        subComponentId={subComponentId}
      />
    </div>
  );
}
