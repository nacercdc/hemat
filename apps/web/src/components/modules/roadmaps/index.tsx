"use client";

import { PageContainer } from "../components/PageContainer";
import { RoadmapsTable } from "./components/table";

export function Roadmaps() {
  return (
    <PageContainer pageTitle="Roadmaps" includeBreadcrumb={false}>
      <RoadmapsTable />
    </PageContainer>
  );
}
