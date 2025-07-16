"use client";

import React, { useState } from "react";
import { CheckboxFilter } from "@etm/web-ui-components";
import { SupportStatus } from "~/libs/models/support.model";

export interface StatusType {
  label: SupportStatus;
  value: SupportStatus;
}

const StatusTypesOptions: StatusType[] = [
  { label: SupportStatus.OPEN, value: SupportStatus.OPEN },
  { label: SupportStatus.CLOSED, value: SupportStatus.CLOSED },
  { label: SupportStatus.PROCESSING, value: SupportStatus.PROCESSING },
];

interface Props {
  onStatusTypeCheck: (statusTypes?: StatusType[]) => void;
}
export default function Toolbar({ onStatusTypeCheck }: Props) {
  const [checkedStatusTypes, setCheckedStatusTypes] = useState<StatusType[]>();

  const onCheckStatusTypesHandler = (values?: StatusType[]) => {
    setCheckedStatusTypes(values);
    onStatusTypeCheck(values);
  };

  return (
    <div className="flex justify-between items-center gap-4">
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
