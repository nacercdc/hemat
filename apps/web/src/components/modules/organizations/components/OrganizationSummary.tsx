import React from "react";
import SummaryCard from "../../components/SummaryCard";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function OrganizationSummary() {
  return (
    <div className="flex gap-4">
      <SummaryCard
        title="50"
        subtitle="Total Organization"
        icon={<Icon icon="octicon:organization-16" className="w-8 h-8" />}
      />
      <SummaryCard
        title="50"
        subtitle="Active Organization"
        icon={<Icon icon="codicon:organization" className="w-8 h-8" />}
      />
      <SummaryCard
        title="50"
        subtitle="Inactive Organization"
        icon={<Icon icon="codicon:organization" className="w-8 h-8" />}
      />
    </div>
  );
}
