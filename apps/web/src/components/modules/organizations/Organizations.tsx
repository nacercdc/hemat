import React from "react";
import OrganizationSummary from "./components/summary";
import OrganizationTable from "./components/table";
import { PageHeader } from "../components/PageHeader";

export default function Organizations() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader pageTitle="Organizations" listCount={400} />
      <OrganizationSummary />
      <OrganizationTable />
    </div>
  );
}
