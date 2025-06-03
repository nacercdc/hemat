"use client";

import React, { useImperativeHandle, useState } from "react";
import { Breadcrumbs } from "./Breadcrumb";
import { cn } from "~/utils/cn.util";

export interface HeaderRef {
  scrolled: (hasScrolled: boolean) => void;
}

interface Props {
  pageTitle: string;
  breadcrumb?: boolean;
  actions?: React.ReactNode;
}

export const PageHeader = React.forwardRef<HeaderRef, Props>(
  ({ pageTitle, breadcrumb = true, actions }, ref) => {
    const [containerScrolled, setContainerScrolled] = useState(false);

    useImperativeHandle(ref, () => {
      return {
        scrolled: (hasScrolled: boolean) => setContainerScrolled(hasScrolled),
      };
    }, []);

    return (
      <div
        className={cn(
          "flex items-center justify-between sticky top-0 z-20 bg-white pt-7",
          containerScrolled &&
            "-mx-7 px-7 border-b border-success-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
        )}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          {breadcrumb && <Breadcrumbs />}
        </div>
        {actions}
      </div>
    );
  }
);
