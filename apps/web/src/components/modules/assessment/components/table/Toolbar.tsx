"use client";

import React, { useState } from "react";
import { Select } from "@etm/web-ui-components";

export enum StatusEnum {
  DRAFT = "draft",
  PENDING = "pending",
  READY = "ready",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
  COMPLETED = "completed",
}

export interface StatusType {
  label: string;
  value: string;
}

const StatusTypesOptions: StatusType[] = [
  { label: "Draft", value: StatusEnum.DRAFT },
  { label: "Pending", value: StatusEnum.PENDING },
  { label: "Ready", value: StatusEnum.READY },
  { label: "In Progress", value: StatusEnum.IN_PROGRESS },
  { label: "Closed", value: StatusEnum.CLOSED },
  { label: "Completed", value: StatusEnum.COMPLETED },
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
