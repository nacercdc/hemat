"use client";

import React, { useEffect, useRef } from "react";
import type { HeaderRef } from "./PageHeader";
import { PageHeader } from "./PageHeader";

interface Props {
  pageTitle: string;
  includeBreadcrumb?: boolean;
  actionNodes?: React.ReactNode;
  children: React.ReactNode;
  onBack?: () => void;
}

export function PageContainer({
  pageTitle,
  includeBreadcrumb,
  actionNodes,
  children,
  onBack,
}: Props) {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const pageHeaderRef = useRef<HeaderRef>(null);

  useEffect(() => {
    const div = pageContainerRef.current;
    if (!div) return;

    const handleScroll = () => {
      if (div.scrollTop > 10) {
        pageHeaderRef.current?.scrolled(true);
      } else {
        pageHeaderRef.current?.scrolled(false);
      }
    };

    div.addEventListener("scroll", handleScroll, { passive: true });
    return () => div.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      ref={pageContainerRef}
      className="flex flex-col gap-4 w-full rounded-md px-4 pb-7 bg-white h-[calc(100vh-120px)] overflow-y-scroll overflow-x-hidden"
    >
      <PageHeader
        pageTitle={pageTitle}
        breadcrumb={includeBreadcrumb}
        actions={actionNodes}
        onBack={onBack}
        ref={pageHeaderRef}
      />
      {children}
    </div>
  );
}
