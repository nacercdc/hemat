"use client";

import React, { useState } from "react";
import { Select } from "@etm/web-ui-components";
import { UserStatus } from "~/libs/models/user.model";

export interface StatusType {
  label: string;
  value: string;
}

const StatusTypesOptions: StatusType[] = [
  { label: UserStatus.ACTIVE, value: UserStatus.ACTIVE },
  { label: UserStatus.INACTIVE, value: UserStatus.INACTIVE },
];
interface Props {
  onStatusTypeSelect: (statusTypes?: StatusType) => void;
}

export default function Toolbar({ onStatusTypeSelect }: Props) {
  const [selectedStatusType, setSelectedStatusType] = useState<
    StatusType | undefined
  >();

  const onCheckStatusTypesHandler = (value?: StatusType) => {
    setSelectedStatusType(value);
    onStatusTypeSelect(value);
  };

  return (
    <div className="flex justify-between items-center gap-4">
      <Select<StatusType>
        size="lg"
        labelVariant="medium"
        valueKey="value"
        labelKey="label"
        options={StatusTypesOptions}
        placeholder="Filter by status"
        value={selectedStatusType}
        onSelect={onCheckStatusTypesHandler}
      />
    </div>
  );
}
