import React from "react";
import { Breadcrumbs } from "./Breadcrumb";

interface Props {
  pageTitle: string;
  breadcrumb?: boolean;
  actions?: React.ReactNode;
}

export function PageHeader({ pageTitle, breadcrumb = true, actions }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        {breadcrumb && <Breadcrumbs />}
      </div>
      {actions}
    </div>
  );
}
