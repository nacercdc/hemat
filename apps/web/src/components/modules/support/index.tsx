"use client";

import React from "react";
import { PageContainer } from "../components/PageContainer";
import { SupportTable } from "./components/table";
import type { Support } from "~/libs/models/support.model";

export default function Support() {
  return (
    <PageContainer pageTitle="Supports" includeBreadcrumb={false}>
      <SupportTable />
    </PageContainer>
  );
}
