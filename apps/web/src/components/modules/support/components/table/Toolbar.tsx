"use client";

import React, { useState } from "react";
import { CheckboxFilter } from "@etm/web-ui-components";
import { StatusEnum } from "~/libs/models/support.model";

export interface StatusType {
  label: StatusEnum;
  value: StatusEnum;
}

const StatusTypesOptions: StatusType[] = [
  { label: StatusEnum.OPEN, value: StatusEnum.OPEN },
  { label: StatusEnum.CLOSE, value: StatusEnum.CLOSE },
  { label: StatusEnum.PROCESSING, value: StatusEnum.PROCESSING },
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
