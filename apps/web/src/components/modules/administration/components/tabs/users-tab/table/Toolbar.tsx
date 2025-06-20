"use client";

import React, { useState } from "react";
import { CheckboxFilter } from "@etm/web-ui-components";
import { UserStatus } from "~/libs/models/user.model";

export interface StatusType {
  label: UserStatus;
  value: boolean;
}

const StatusTypesOptions: StatusType[] = [
  { label: UserStatus.ACTIVE, value: true },
  { label: UserStatus.INACTIVE, value: false },
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
