"use client";

import { useEffect, useState } from "react";

import { Content } from "./components/Content";

import type { AssessmentDomain } from "~/libs/models/assessment-domain.model";
import { Sidebar } from "../../Sidebar";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useParams } from "next/navigation";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { Icon } from "@iconify/react/dist/iconify.js";

export function Domain() {
  const params = useParams();
  const { id: assessmentId } = params;
  const { data: domains, ...domainsState } = useFindAll<AssessmentDomain>({
    path: `/assessments/${assessmentId as string}/domains`,
  });
  const [activeDomain, setActiveDomain] = useState<AssessmentDomain | null>(
    null
  );

  useEffect(() => {
    if (domains?.data && domains.data.length > 0) {
      setActiveDomain(domains.data[0] || null);
    }
  }, [domains]);

  return domains?.data && domains.data.length > 0 ? (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar<AssessmentDomain>
        list={domains?.data ?? []}
        activeItem={activeDomain}
        isLoading={domainsState.isLoading}
        onItemSelect={setActiveDomain}
        displayKey="name"
      />
      <Content
        activeDomain={activeDomain}
        assessmentId={assessmentId as string}
        refetchDomains={domainsState.refetch}
      />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full  min-h-96">
      <EmptyTableDataElement
        title="No domains found"
        icon={
          <Icon
            icon="material-symbols-light:domain-rounded"
            className="!w-[30px] !h-[30px]"
          />
        }
      />
    </div>
  );
}

export default Domain;
