"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { ComponentsList } from "./components/components-list";
import {
  SubCompAssessmentForm,
  SubCompAssessmentFormID,
} from "./components/form";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { Button, useToast } from "@etm/web-ui-components";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { Stepper } from "./components/Stepper";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import type { Component } from "./components/components-list";
import type { AssessmentFormData } from "./components/form";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { SubComponent } from "~/libs/models/subComponent.model";
import type {
  Assessment,
  AssessmentFilterable,
} from "~/libs/models/assessment.model";

//TODO: to be refactored and put into its own model
interface FilledStatus {
  ids: string[];
  latest: { subComponentId: string };
}

export interface FilledSubComponent extends SubComponent {
  filled: boolean;
}

export function CurrentAssessmentFill() {
  const router = useRouter();

  const params = useParams();

  const searchParams = useSearchParams();

  const { toast } = useToast();

  const [activeComponent, setActiveComponent] = useState<Component>();

  const { data: assessmentDetail, ...assessmentDetailState } = useFindById<
    Assessment,
    AssessmentFilterable
  >({
    path: `assessments/${params.id as string}`,
    tqOptions: {
      queryKey: ["assessment", params.id as string],
    },
  });

  const [activeSubComponentIndex, setActiveSubComponentIndex] =
    useState<number>(0);

  const { mutate: answerAssessment, ...answerAssessmentState } = useAddMutation<
    { id: string; name: string },
    AssessmentFormData & {
      assessmentId: string;
      measurementScaleId: string;
      subComponentId: string;
      isPrimary: boolean;
    }
  >(`assessments/${params.id as string}/answers`);

  const { data: components, ...componentsState } = useFindAll<
    QueryManyResponse<{ id: string; name: string }>
  >({
    path: `/assessmentDomains/${params.currentAssessmentId as string}/components`,
    queries: {
      limit: 100,
      page: 1,
    },
  });

  const { data: subComponents, ...subComponentsState } = useFindAll<
    QueryManyResponse<{ id: string; name: string }>
  >({
    path: `/assessmentSubcomponents/${activeComponent?.id}/subcomponents`,
    queries: {
      limit: 100,
      page: 1,
    },
    tqOptions: {
      enabled: !!activeComponent,
    },
  });

  const { data: filledSubComps, ...filledSubCompsState } = useFindById<
    QueryManyResponse<FilledStatus>
  >({
    path: `/assessments/${params.id as string}/sub-components/filled-status`,
  });

  const isFirstSubComponent = activeSubComponentIndex === 0;

  const isLastSubComponent =
    activeSubComponentIndex + 1 === subComponents?.data.length;

  const filledSubComponents: FilledSubComponent[] =
    (subComponents?.data as unknown as SubComponent[])?.map((subComp) => ({
      ...subComp,
      filled: (filledSubComps as unknown as FilledStatus)?.ids.includes(
        subComp.id
      ),
    })) || [];

  const isSubComponentDataLoading =
    subComponentsState.isPending ||
    subComponentsState.isLoading ||
    subComponentsState.isFetching;

  const isAssessmentDetailLoading =
    assessmentDetailState.isFetching || assessmentDetailState.isLoading;

  const isPermittedToAnswer = useMemo(() => {
    return (
      assessmentDetail?.access?.domains
        .map((domain) => domain.id)
        .includes(params.currentAssessmentId as string) &&
      (assessmentDetail?.access?.role === "primary" ||
        assessmentDetail?.access?.role === "team-leader")
    );
  }, [
    assessmentDetail?.access?.domains,
    assessmentDetail?.access?.role,
    params.currentAssessmentId,
  ]);

  const onNavigateSubCompHandler = useCallback(
    (direction: "next" | "prev" | number) => {
      if (typeof direction === "number") {
        if (direction >= 0 && direction < (subComponents?.data?.length || 0)) {
          setActiveSubComponentIndex(direction);
        }
      } else if (direction === "prev" && !isFirstSubComponent) {
        setActiveSubComponentIndex((prev) => prev - 1);
      } else if (direction === "next" && !isLastSubComponent) {
        setActiveSubComponentIndex((prev) => prev + 1);
      }
    },
    [isFirstSubComponent, isLastSubComponent, subComponents?.data]
  );

  const onComponentClickHandler = (id: string) => {
    const componentIndex = (
      components?.data as unknown as Component[]
    ).findIndex((comp) => comp.id === id);
    setActiveComponent(
      components?.data[componentIndex] as unknown as Component
    );
    setActiveSubComponentIndex(0);
  };

  const onFormSubmitTriggerHandler = () => {
    const form = document.getElementById(
      `${SubCompAssessmentFormID}`
    ) as HTMLFormElement;

    if (!form) return;

    form.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  const onAssessmentSubmitHandler = (values: AssessmentFormData) => {
    answerAssessment(
      {
        data: {
          ...values,
          measurementScaleId: values.measurementScale.id,
          assessmentId: `${params.id as string}`,
          subComponentId: (
            subComponents?.data[
              activeSubComponentIndex
            ] as unknown as SubComponent
          ).id,
          isPrimary:
            assessmentDetail?.access?.role === "primary" &&
            searchParams.get("as") !== "member",
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Assessment has been answered successfully!",
            variant: "success",
          });
          filledSubCompsState.refetch();
          onNavigateSubCompHandler("next");
        },
      }
    );
  };

  const onGoBackClickHandler = () => {
    router.back();
  };

  useEffect(() => {
    if (components?.data.length) {
      setActiveComponent(components?.data[0] as unknown as Component);
    }
  }, [components?.data]);

  return (
    <PageContainer
      //TODO: will be dynamic ass soon as the tab routing is fixed
      pageTitle={`${"Assessment 1"} / Fill`}
      includeBreadcrumb={false}
      onBack={onGoBackClickHandler}
    >
      <div className="flex flex-col gap-5 h-full w-full">
        <div className="flex w-full h-12 bg-basic-200 rounded-md px-5 py-3">
          {/* TODO: substitute this with real domain data */}
          <span className="text-xl font-bold">{`${"Domain 1"} / Components`}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 w-full">
          <ComponentsList
            components={components?.data as unknown as Component[]}
            statusLoading={
              filledSubCompsState.isFetching ||
              filledSubCompsState.isLoading ||
              !(subComponents?.data as unknown as SubComponent[])
            }
            filledSubs={filledSubComponents}
            numberOfSubs={
              (subComponents?.data as unknown as SubComponent[])?.length || 0
            }
            onClick={onComponentClickHandler}
            isLoading={componentsState.isFetching}
          />
          <div className="lg:col-span-4 col-span-full">
            <div className="flex flex-col gap-1 relative">
              <div className="mt-2">
                <SubCompAssessmentForm
                  onSubmitHandler={onAssessmentSubmitHandler}
                  subComponent={
                    subComponents?.data[
                      activeSubComponentIndex
                    ] as unknown as SubComponent
                  }
                  access={assessmentDetail?.access}
                  isLoading={
                    isSubComponentDataLoading || isAssessmentDetailLoading
                  }
                />
              </div>
              <div className="flex w-full gap-4 justify-between mt-5 mb-20">
                {isPermittedToAnswer && (
                  <Button
                    onClick={() => onNavigateSubCompHandler("prev")}
                    disabled={isFirstSubComponent || isSubComponentDataLoading}
                    variant="outline"
                    size="lg"
                  >
                    Previous
                  </Button>
                )}
                {isPermittedToAnswer && (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubComponentDataLoading}
                    loading={answerAssessmentState.isPending}
                    onClick={onFormSubmitTriggerHandler}
                  >
                    {isLastSubComponent ? "Save" : "Next"}
                  </Button>
                )}
              </div>
              <div className="justify-self-center absolute top-0 left-0 right-0 mx-auto z-10 w-full bg-dark-lighter/20 backdrop-blur-sm rounded-md rounded-b-none overflow-hidden px-2">
                <Stepper
                  steps={filledSubComponents}
                  activeStep={activeSubComponentIndex}
                  onStepClick={onNavigateSubCompHandler}
                  isDisabled={
                    isSubComponentDataLoading || answerAssessmentState.isPending
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
