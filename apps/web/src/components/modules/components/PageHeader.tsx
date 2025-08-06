"use client";

import React, { useImperativeHandle, useState } from "react";
import { Breadcrumbs } from "./Breadcrumb";
import { cn } from "~/utils/cn.util";
import { Icon } from "@iconify/react/dist/iconify.js";

export interface HeaderRef {
  scrolled: (hasScrolled: boolean) => void;
}

interface Props {
  pageTitle: string | React.ReactNode;
  breadcrumb?: boolean;
  actions?: React.ReactNode;
  onBack?: () => void;
}

export const PageHeader = React.forwardRef<HeaderRef, Props>(
  ({ pageTitle, breadcrumb = true, actions, onBack }, ref) => {
    const [containerScrolled, setContainerScrolled] = useState(false);

    useImperativeHandle(ref, () => {
      return {
        scrolled: (hasScrolled: boolean) => setContainerScrolled(hasScrolled),
      };
    }, []);

    return (
      <div
        className={cn(
          "flex items-center justify-between sticky top-0 z-20 bg-white py-4 max-[350px]:flex-col max-[350px]:items-start max-[350px]:gap-2",
          containerScrolled &&
            "-mx-7 px-7 border-b border-success-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-6">
            {onBack && (
              <div
                className="flex items-center justify-center w-11 h-11 rounded-full bg-basic-200 cursor-pointer"
                onClick={onBack}
              >
                <Icon
                  fontWeight="bold"
                  icon="ion:chevron-back-outline"
                  className="w-5 h-5 text-primary "
                />
              </div>
            )}
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
          </div>
          {breadcrumb && <Breadcrumbs />}
        </div>
        {actions}
      </div>
    );
  }
);
