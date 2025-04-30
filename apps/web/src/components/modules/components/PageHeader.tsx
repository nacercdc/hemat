import React from "react";

interface Props {
  pageTitle: string;
  listCount?: number;
  breadCrumb?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({
  pageTitle,
  listCount,
  breadCrumb,
  actions,
}: Props) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <div className="py-1 px-2 rounded-full bg-white text-xs text-primary font-semibold">
            {listCount}
          </div>
        </div>
        {breadCrumb}
      </div>
      {actions}
    </div>
  );
}
