"use client";

import React, { useState } from "react";
import { CheckboxFilter } from "@etm/web-ui-components";

export interface StatusType {
  label: string;
  value: boolean;
}

const StatusTypesOptions: StatusType[] = [
  { label: "Active", value: true },
  { label: "InActive", value: false },
];

interface Props {
  onStatusTypeCheck: (statusTypes?: StatusType[]) => void;
  onPrint?: () => void;
}
export default function Toolbar({ onStatusTypeCheck, onPrint }: Props) {
  const [checkedStatusTypes, setCheckedStatusTypes] = useState<StatusType[]>();

  const onCheckStatusTypesHandler = (values?: StatusType[]) => {
    setCheckedStatusTypes(values);
    onStatusTypeCheck(values);
  };

  const _onPrintHandler = () => {
    onPrint?.();
  };

  return (
    <div className="flex justify-between  items-center gap-4">
      <CheckboxFilter<StatusType>
        title="Filter"
        options={StatusTypesOptions}
        labelKey="label"
        valueKey="value"
        values={checkedStatusTypes}
        size="lg"
        variant="outline"
        loading={false}
        onValuesChange={onCheckStatusTypesHandler}
      />
    </div>
  );
}
