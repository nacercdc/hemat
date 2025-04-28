import React from "react";
import OrganizationSummary from "./components/summary";
import OrganizationTable from "./components/table";

export default function Organizations() {
  return (
    <div className="flex flex-col gap-6">
      <OrganizationSummary />
      <OrganizationTable />
    </div>
  );
}
