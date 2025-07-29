"use client";

import React, { useCallback } from "react";
// import DomainComponent from "../components/DomainComponent";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";

import type { Domain, DomainIncludable } from "~/libs/models/domain.model";

export default function DetailAssessmentResponse() {
  const router = useRouter();
  const params = useParams(); // this gets dynamic segments like domainId
  const searchParams = useSearchParams(); // this gets query params like domainId and groupId
  const domainId = params.currentAssessmentId;
  const assessmentId = params.id;
  // const domainId = searchParams.get("domainId");
  const groupId = searchParams.get("groupId");
  console.log("currentAssessmentId:", domainId);
  console.log("Assessment ID:", assessmentId);
  const onBackHandler = useCallback(() => {
    router.back();
  }, [router]);

  const {
    data: assessmentGroups,

    ...assessmentGroupsState
  } = useFindAll<Domain, DomainIncludable>({
    path: `assessments/${assessmentId as string}/domains/${domainId as string}/answers`,
    queries: {
      include: ["components"],
    },
    tqOptions: {},
  });

  const domain = assessmentGroups?.data?.[0];
  if (assessmentGroupsState.isLoading) {
    return (
      <PageContainer
        pageTitle="Loading..."
        includeBreadcrumb={false}
        onBack={onBackHandler}
      >
        <div className="p-6 text-sm text-gray-500">
          Loading assessment responses...
        </div>
      </PageContainer>
    );
  }

  if (assessmentGroupsState.isError || !domain) {
    return (
      <PageContainer
        pageTitle="Error"
        includeBreadcrumb={false}
        onBack={onBackHandler}
      >
        <div className="p-6 text-sm text-red-500">
          Failed to load data or no data found.
        </div>
      </PageContainer>
    );
  }
  return (
    <PageContainer
      pageTitle={
        <div className="flex gap-4 items-center  ">
          <h1 className="font-bold text-lg">{domain?.name}</h1>
          <span className="px-3 py-1  bg-primary  font-bold text-sm text-white rounded-sm">
            5
          </span>
        </div>
      }
      includeBreadcrumb={false}
      onBack={onBackHandler}
    >
      <div className="p-6 flex flex-col gap-6">
        {domain?.components?.map((component, componentIndex) => (
          <div key={component.id} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm">
                {componentIndex + 1}. {component.name}
              </h2>
            </div>

            {component.subComponents?.map((sub, subIndex) => (
              <div key={sub.id} className="ml-4 border-l-2 pl-4">
                <h3 className="font-semibold text-sm">
                  {componentIndex + 1}.{subIndex + 1} {sub.name}
                </h3>
                <p className="text-xs italic">{sub.description}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="bg-primary text-white px-2 py-1 rounded text-xs font-bold">
                    {sub.answer?.measurementScale?.rate ?? "-"}
                  </span>
                  <span className="text-xs text-gray-700">
                    {sub.answer?.measurementScale?.name}
                  </span>
                </div>
                <div className="text-xs mt-2">
                  <p>
                    <strong>Evidence:</strong>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: sub.answer?.evidence ?? "-",
                      }}
                    />
                  </p>
                  <p>
                    <strong>Reference:</strong>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: sub.answer?.reference ?? "-",
                      }}
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
