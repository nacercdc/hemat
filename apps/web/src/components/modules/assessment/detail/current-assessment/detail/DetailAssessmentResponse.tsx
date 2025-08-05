"use client";

import React, { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "~/components/modules/components/PageContainer";

import type { DomainIncludable } from "~/libs/models/domain.model";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { DomainDetailSkeleton } from "./DomainDetailSkeleton";

export interface Domain {
  id: string;
  name: string;
  description: string;
  components: Component[];
}

interface Component {
  id: string;
  name: string;
  description: string;
  subComponents: SubComponent[];
}

interface SubComponent {
  id: string;
  name: string;
  description: string;
  answer: Answer;
}

interface Answer {
  id: string;
  measurementScale: MeasurementScale;
  evidence: string;
  reference: string;
  notes: string | null;
  isCompressed: boolean;
}

interface MeasurementScale {
  id: string;
  name: string;
  rate: number;
}

type Scales = "Initial" | "Developing" | "Defined" | "Managed" | "Optimized";

export const ScalesMap: Record<number, { label: Scales; color: string }> = {
  1: { label: "Initial", color: "#FF0101" },
  2: { label: "Developing", color: "#FFC000" },
  3: { label: "Defined", color: "#FFFD02" },
  4: { label: "Managed", color: "#00B0F0" },
  5: { label: "Optimized", color: "#11B050" },
};

// Helper to calculate average rate per component
function calculateAverageRate(subComponents: SubComponent[]): number | null {
  const validRates = subComponents
    .map((sub) => sub.answer?.measurementScale?.rate)
    .filter((rate): rate is number => typeof rate === "number");

  if (validRates.length === 0) return null;

  const total = validRates.reduce((acc, rate) => acc + rate, 0);
  return parseFloat((total / validRates.length).toFixed(2));
}

export default function DetailAssessmentResponse() {
  const router = useRouter();
  const params = useParams<{ id: string; currentAssessmentId: string }>();

  const domainId = params?.currentAssessmentId;
  const assessmentId = params?.id;

  const onBackHandler = useCallback(() => {
    router.back();
  }, [router]);

  const { data: assessmentGroups, ...assessmentGroupsState } = useFindById<
    Domain,
    DomainIncludable
  >({
    path: `assessments/${assessmentId}/domains/${domainId}/answers`,
    queries: {
      include: ["components"],
    },
    tqOptions: {},
  });

  const domain = assessmentGroups;

  if (assessmentGroupsState.isLoading) {
    return <DomainDetailSkeleton />;
  }

  return (
    <PageContainer
      pageTitle={
        <div className="flex gap-4 items-center">
          <h1 className="font-bold text-lg">
            Domain: {assessmentGroups?.name}
          </h1>
        </div>
      }
      includeBreadcrumb={false}
      onBack={onBackHandler}
    >
      <div className="flex flex-col gap-4 rounded-sm p-4">
        {domain?.components?.map((component, componentIndex) => {
          const averageRate = calculateAverageRate(component.subComponents);

          return (
            <div key={component.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <h1 className="font-bold text-sm">
                  {componentIndex + 1}. {component.name}
                </h1>
                {averageRate !== null && (
                  <span
                    className="px-3 py-1 text-white text-sm font-bold rounded-sm"
                    style={{
                      backgroundColor:
                        ScalesMap[Math.round(averageRate)]?.color || "#ccc",
                    }}
                  >
                    {Math.round(averageRate)}
                  </span>
                )}
              </div>

              {component.subComponents?.map((sub, subIndex) => (
                <div key={sub.id} className="ml-4 border-l-2 pl-4">
                  <div className="flex gap-2 items-center">
                    <h1 className="font-bold text-sm">
                      {componentIndex + 1}.{subIndex + 1} {sub.name}
                    </h1>
                    <span
                      className="px-3 py-1 font-bold text-sm text-white rounded-sm"
                      style={{
                        backgroundColor: sub.answer?.measurementScale?.rate
                          ? ScalesMap[sub.answer.measurementScale.rate]?.color
                          : "#ccc",
                      }}
                    >
                      {sub.answer?.measurementScale?.rate ?? "-"}
                    </span>
                  </div>

                  <p className="text-xs">{sub.description}</p>

                  <div className="flex flex-col gap-2">
                    <h1 className="font-semibold text-sm">Evidence</h1>
                    <p>
                      <span
                        className="text-xs"
                        dangerouslySetInnerHTML={{
                          __html: sub.answer?.evidence ?? "-",
                        }}
                      />
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h1 className="font-semibold text-sm">Reference</h1>
                    <p>
                      <span
                        className="text-xs"
                        dangerouslySetInnerHTML={{
                          __html: sub.answer?.reference ?? "-",
                        }}
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
