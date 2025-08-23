"use client";

import React, { useCallback, useMemo, useState } from "react";
import { GroupedAssessment } from "./components/GroupedAssessment";
import AssessmentFillHeader from "../components/AssessmentFillHeader";
import type {
  Assessment,
  AssessmentFilterable,
} from "~/libs/models/assessment.model";
import { useParams } from "next/navigation";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  AssessmentRoleType,
  Domain,
} from "../components/AssessmentDomainCard";
import type {
  Group,
  GroupIncludeAble,
} from "~/libs/models/assessment-group.model";
import { GroupSkeleton } from "./components/GroupSkeleton";
import { usePatchMutation } from "~/libs/tanstack-api-query/hooks/usePatchMutation";
import { useToast } from "@etm/web-ui-components";

export function CurrentAssessment() {
  const params = useParams();
  const { toast } = useToast();
  const assessmentId = params.id;
  const [selectedLanguage, setSelectedLanguage] = useState<
    string | undefined
  >();

  const { data: assessmentDetail, ...assessmentDetailState } = useFindById<
    Assessment,
    AssessmentFilterable
  >({
    path: `assessments/${assessmentId as string}`,
    tqOptions: {
      queryKey: ["assessment", assessmentId as string],
    },
  });

  const { data: assessmentGroups, ...assessmentGroupsState } = useFindAll<
    Group,
    GroupIncludeAble
  >({
    path: `assessments/${assessmentId as string}/groups`,
    queries: {
      include: ["domains"],
    },
    tqOptions: {
      queryKey: ["assessment-groups"],
    },
  });

  const { data: assessmentDomains, ...assessmentDomainsState } =
    useFindAll<Domain>({
      path: `assessments/${assessmentId as string}/assessment-domains${selectedLanguage ? `?language=${selectedLanguage}` : ""}`,
      tqOptions: {
        queryKey: ["assessment-domains"],
      },
    });

  const { data: primaryProgress, ...primaryProgressState } = useFindById<{
    assessmentId: string;
    domains: { id: string; name: string; percentage: number }[];
  }>({
    path: `/assessments/${assessmentId as string}/domains/progress/primary`,
    tqOptions: {
      queryKey: ["primary-progress"],
    },
  });

  const { data: restProgress, ...restProgressState } = useFindById<
    {
      assessmentId: string;
      domains: { id: string; name: string; percentage: number }[];
    }[]
  >({
    path: `/assessments/${assessmentId as string}/domains/progress`,
    tqOptions: {
      queryKey: ["my-progress"],
    },
  });

  const { mutate: submitPrimaryAssessment, ...submitPrimaryAssessmentState } =
    usePatchMutation<
      { id: string },
      {
        status: "submitted";
      }
    >(`/assessments/${assessmentId as string}/answers/submit`);

  const allAssessmentDomains = assessmentDomains as unknown as Domain[];
  const allAssessmentGroups = assessmentGroups?.data as unknown as Group[];

  const getProgress = useCallback(
    (domain: Domain) => {
      let progress = 0;
      restProgress?.forEach((catProgress) => {
        const percentage = catProgress.domains?.find(
          (prog) => prog.id === domain.id
        )?.percentage;

        if (percentage) {
          progress = percentage;
          return;
        }
      });
      return progress;
    },
    [restProgress]
  );

  const primaryDomainList = useMemo(() => {
    return allAssessmentDomains?.map((domain) => ({
      ...domain,
      progress:
        primaryProgress?.domains?.find(
          (pProgress) => pProgress.id === domain.id
        )?.percentage || 0,
      fillAccess: "primary" as AssessmentRoleType,
    }));
  }, [allAssessmentDomains, primaryProgress?.domains]);

  const myDomainList = useMemo(() => {
    const myDomains = allAssessmentDomains?.filter((assDomain) =>
      assessmentDetail?.access?.domains?.find(
        (domain) => domain.id === assDomain.id
      )
    );

    return myDomains?.map((domain) => {
      return {
        ...domain,
        progress: getProgress(domain),
        fillAccess: "team-leader" as AssessmentRoleType,
      };
    });
  }, [allAssessmentDomains, assessmentDetail?.access?.domains, getProgress]);

  const notMyGroups = useMemo(() => {
    const groups = allAssessmentGroups?.filter(
      (assGroup) => assessmentDetail?.access?.groupId !== assGroup.id
    );

    return groups?.map((group) => {
      const groupDomainIds = group.domains?.map((domain) => domain.id);
      return {
        ...group,
        domains: allAssessmentDomains
          ?.filter((assDom) => groupDomainIds.includes(assDom.id))
          ?.map((filteredDom) => {
            return {
              ...filteredDom,
              fillAccess: "member" as AssessmentRoleType,
              progress: getProgress(filteredDom),
            };
          }),
      };
    });
  }, [
    allAssessmentDomains,
    allAssessmentGroups,
    assessmentDetail?.access?.groupId,
    getProgress,
  ]);

  const assessmentLoading =
    assessmentDomainsState.isLoading ||
    assessmentDomainsState.isFetching ||
    assessmentDetailState.isLoading ||
    assessmentDetailState.isFetching;

  const groupsLoading =
    assessmentGroupsState.isFetching || assessmentGroupsState.isLoading;

  const restProgressLoading =
    restProgressState.isFetching || restProgressState.isLoading;

  const primaryProgressLoading =
    primaryProgressState.isFetching || primaryProgressState.isLoading;

  const primaryCategoryLoading = assessmentLoading || primaryProgressLoading;

  const ownCategoryLoading = assessmentLoading || restProgressLoading;

  const restCategoryLoading =
    assessmentLoading || restProgressLoading || groupsLoading;

  const submitPrimaryAssessmentHandler = () => {
    submitPrimaryAssessment(
      { data: { status: "submitted" } },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Primary Assessment has been submitted successfully!",
            variant: "success",
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col  bg-layout-bg/15 rounded-md">
      <AssessmentFillHeader
        title="All Assessments"
        subTitle="Team and team leader's assessments"
        languages={assessmentDetail?.languages || []}
        onLanguageChangeHandler={(lang?: string) => setSelectedLanguage(lang)}
      />

      <div className="flex flex-col w-full rounded-md gap-3 p-3">
        {!primaryCategoryLoading && primaryDomainList?.length > 0 && (
          <GroupedAssessment
            groupTag="primary"
            title="Primary"
            subtitle="Primary Assessment"
            domains={primaryDomainList}
            access={assessmentDetail?.access}
            assessmentId={assessmentId as string}
            groupId={assessmentDetail?.access?.groupId}
            status={assessmentDetail?.status}
            onAction={submitPrimaryAssessmentHandler}
            actionLoading={submitPrimaryAssessmentState.isPending}
          />
        )}

        {primaryCategoryLoading && <GroupSkeleton />}

        {!ownCategoryLoading && myDomainList?.length > 0 && (
          <GroupedAssessment
            groupTag="my"
            groupId={assessmentDetail?.access?.groupId}
            title="My"
            subtitle="My Assessment"
            domains={myDomainList}
            access={assessmentDetail?.access}
            status={assessmentDetail?.status}
            assessmentId={assessmentId as string}
          />
        )}

        {ownCategoryLoading && <GroupSkeleton />}

        {!restCategoryLoading &&
          assessmentDetail?.access?.role === "primary" &&
          notMyGroups?.map((group) => (
            <GroupedAssessment
              key={group.id}
              groupId={group.id}
              groupTag="rest"
              title={group.name}
              subtitle={`${group.name}'s Assessment`}
              domains={group.domains}
              status={assessmentDetail?.status}
              assessmentId={assessmentId as string}
            />
          ))}

        {restCategoryLoading && <GroupSkeleton />}
      </div>
    </div>
  );
}
