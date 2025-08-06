"use client";

import React, { useCallback, useState } from "react";
import { Badge, Select } from "@etm/web-ui-components";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "~/components/modules/components/PageContainer";
import RoadmapDomainComponent from "../components/RoadmapDomainComponent";
import type { DomainIncludable } from "~/libs/models/domain.model";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import type { RoadmapDomain } from "~/libs/models/roadmap.model";
import {
  calculateAverageCurrent,
  calculateAverageTarget,
} from "../utils/averages.utils";
import type { Language } from "~/libs/models/language.model";
import type {
  Assessment,
  AssessmentsIncludeAble,
} from "~/libs/models/assessment.model";
import { DomainDetailSkeleton } from "./DomainDetailSkeleton";

export default function DetailRoadmapResponse() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>();

  const router = useRouter();
  const params = useParams<{ id: string; roadmapDomainId: string }>();

  const domainId = params?.roadmapDomainId;
  const assessmentId = params?.id;

  const onBackHandler = useCallback(() => {
    router.back();
  }, [router]);

  const { data: assessment, ..._assessmentState } = useFindById<
    Assessment,
    AssessmentsIncludeAble
  >({
    path: `assessments/${assessmentId}`,
    queries: {
      include: ["user"],
    },
  });

  const { data: domainRoadmap, ...domainRoadmapState } = useFindById<
    RoadmapDomain,
    DomainIncludable
  >({
    path: `assessments/${assessmentId}/domains/${domainId}/roadmap${selectedLanguage ? `?language=${selectedLanguage.code}` : ""}`,

    tqOptions: { enabled: !!assessmentId && !!domainId },
  });

  const allSubComponents = domainRoadmap?.components.flatMap(
    (comp) => comp.subComponents ?? []
  );

  if (domainRoadmapState.isLoading) {
    return <DomainDetailSkeleton />;
  }

  return (
    <PageContainer
      pageTitle={
        <div className="flex gap-4 items-center  ">
          <h1 className="font-bold text-lg">
            {domainRoadmap?.code}. {domainRoadmap?.name}
          </h1>
          {allSubComponents?.length && allSubComponents.length > 0 && (
            <Badge
              text={`Current : ${
                calculateAverageCurrent(allSubComponents) ?? "-"
              }`}
              variant={"info"}
            />
          )}
          {allSubComponents?.length && allSubComponents.length > 0 && (
            <Badge
              text={`Target : ${
                calculateAverageTarget(allSubComponents) ?? "-"
              }`}
              variant={"success"}
            />
          )}
        </div>
      }
      actionNodes={
        <div className="flex">
          <Select<Language>
            placeholder="Language"
            options={assessment?.languages ?? []}
            valueKey="code"
            labelKey="name"
            onSelect={(lang?: Language) => setSelectedLanguage(lang)}
            value={selectedLanguage}
            size="md"
          />
        </div>
      }
      includeBreadcrumb={false}
      onBack={onBackHandler}
    >
      {domainRoadmap?.components.map((comp) => (
        <RoadmapDomainComponent component={comp} key={comp.code} />
      ))}
    </PageContainer>
  );
}
