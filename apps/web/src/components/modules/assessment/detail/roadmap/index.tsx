"use client";

import React, { useMemo, useState } from "react";
import AssessmentFillHeader from "../components/AssessmentFillHeader";
import { AssessmentRoadmap } from "./components/AssessmentRoadmap";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { useParams } from "next/navigation";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  Assessment,
  AssessmentFilterable,
} from "~/libs/models/assessment.model";
import type {
  AssessmentRoleType,
  Domain,
} from "../components/AssessmentDomainCard";
import { GroupSkeleton } from "./components/GroupSkeleton";

export function RoadmapDomainGroup() {
  const params = useParams();

  const [selectedLanguage, setSelectedLanguage] = useState<
    string | undefined
  >();

  const { data: assessmentDetail, ...assessmentDetailState } = useFindById<
    Assessment,
    AssessmentFilterable
  >({
    path: `assessments/${params.id as string}`,
    tqOptions: {
      queryKey: ["assessment", params.id as string],
    },
  });

  const { data: assessmentDomains, ...assessmentDomainsState } =
    useFindAll<Domain>({
      path: `assessments/${params.id as string}/assessment-domains${selectedLanguage ? `?language=${selectedLanguage}` : ""}`,
      tqOptions: {
        queryKey: ["assessment-domains"],
      },
    });

  const { data: roadmapProgress, ...roadmapProgressState } = useFindById<
    {
      id: string;
      name: string;
      percentage: number;
    }[]
  >({
    path: `/assessments/${params.id as string}/roadmaps/progress`,
    tqOptions: {
      queryKey: ["roadmap-progress"],
    },
  });

  const allAssessmentDomains = assessmentDomains as unknown as Domain[];

  const assessmentLoading =
    assessmentDomainsState.isLoading ||
    assessmentDomainsState.isFetching ||
    assessmentDetailState.isLoading ||
    assessmentDetailState.isFetching;

  const progressLoading =
    roadmapProgressState.isFetching || roadmapProgressState.isLoading;

  const categoryLoading = assessmentLoading || progressLoading;

  const roadmapList = useMemo(() => {
    return allAssessmentDomains?.map((domain) => ({
      ...domain,
      progress:
        roadmapProgress?.find((prog) => prog.id === domain.id)?.percentage || 0,
      fillAccess: "primary" as AssessmentRoleType,
    }));
  }, [allAssessmentDomains, roadmapProgress]);

  return (
    <div className="flex flex-col  bg-layout-bg/15 rounded-md">
      <AssessmentFillHeader
        title="Current Roadmap"
        subTitle="This fill by the team leader"
        languages={assessmentDetail?.languages || []}
        onLanguageChangeHandler={(lang?: string) => setSelectedLanguage(lang)}
      />
      <div className="flex flex-col w-full  rounded-md gap-3 p-3">
        {!categoryLoading && (
          <AssessmentRoadmap
            domains={roadmapList}
            access={assessmentDetail?.access}
          />
        )}
        {categoryLoading && <GroupSkeleton />}
      </div>
    </div>
  );
}
