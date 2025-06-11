import React from "react";
import { Icon } from "@iconify/react";

interface Props {
  title: string;
  icon: string;
  placeholderText: string;
}

export default function MemberRoleCard({
  title,
  icon,
  placeholderText,
}: Props) {
  return (
    <div className="p-2 bg-white rounded-sm flex flex-col gap-3">
      <h1 className="text-sm font-bold items-start">{title}</h1>
      <div className="w-full flex flex-col gap-2 items-center">
        <div className="rounded-full bg-layout-bg w-fit flex items-center p-2">
          <Icon icon={icon} className="!w-6 !h-6 text-primary-400" />
        </div>
        <span className="text-xs font-normal text-dark-light">
          {placeholderText}
        </span>
      </div>
    </div>
  );
}
