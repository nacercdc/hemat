"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { ComponentsList } from "./components/components-list";
import {
  SubCompAssessmentForm,
  SubCompAssessmentFormID,
} from "./components/form";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { Button, useToast } from "@etm/web-ui-components";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import type { Component } from "./components/components-list";
import type { AssessmentFormData, SubComponent } from "./components/form";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";

export function CurrentAssessmentFill() {
  const router = useRouter();
  const { toast } = useToast();

  const [activeComponent, setActiveComponent] = useState<Component>();

  const [activeSubComponentIndex, setActiveSubcomponentIndex] =
    useState<number>(0);

  //TODO: this will be replaced with our real assessment-segment from our path param
  const { mutate: answerAssessment, ...answerAssessmentState } = useAddMutation<
    { id: string; name: string },
    AssessmentFormData & {
      assessmentId: string;
      measurementScaleId: string;
      subComponentId: string;
    }
  >("assessments/60063a25-b3c0-4273-af1b-4a43dfee2ddf/answers");

  //TODO: this will be replaced with our real domain-segment from our path param
  const { data: components, ...componentsState } = useFindAll<
    QueryManyResponse<{ id: string; name: string }>
  >({
    path: "/assessmentDomains/9c5c436b-25d3-469d-b3c9-bfaeee2eb0d0/components",
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

  const onComponentClickHandler = (id: string) => {
    const componentIndex = (
      components?.data as unknown as Component[]
    ).findIndex((comp) => comp.id === id);
    setActiveComponent(
      components?.data[componentIndex] as unknown as Component
    );
    setActiveSubcomponentIndex(0);
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
          assessmentId: "60063a25-b3c0-4273-af1b-4a43dfee2ddf",
          subComponentId: (
            subComponents?.data[
              activeSubComponentIndex
            ] as unknown as SubComponent
          ).id,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Assessment has been answered successfully!",
            variant: "success",
          });

          if (!isLastSubcomponent) {
            setActiveSubcomponentIndex((prev) => prev + 1);
          }
        },
      }
    );
  };

  const onGoToPrevAssessment = () => {
    if (!isFirstSubcomponent) {
      setActiveSubcomponentIndex((prev) => prev - 1);
    }
  };

  const onGoBackClickHandler = () => {
    router.back();
  };

  useEffect(() => {
    if (components?.data.length) {
      setActiveComponent(components?.data[0] as unknown as Component);
    }
  }, [components?.data]);

  const isFirstSubcomponent = activeSubComponentIndex === 0;
  const isLastSubcomponent =
    activeSubComponentIndex + 1 === subComponents?.data.length;
  const isSubComponentDataLoading =
    subComponentsState.isPending ||
    subComponentsState.isLoading ||
    subComponentsState.isFetching;

  return (
    <PageContainer
      pageTitle={`${"Assessment 1"} / Fill`}
      includeBreadcrumb={false}
      onBack={onGoBackClickHandler}
    >
      <div className="flex flex-col gap-5 h-full w-full">
        <div className="flex w-full h-12 bg-basic-200 rounded-md px-5 py-3">
          <span className="text-xl font-bold">{`${"Domain 1"} / Components`}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 w-full">
          <ComponentsList
            components={components?.data as unknown as Component[]}
            onClick={onComponentClickHandler}
            isLoading={componentsState.isFetching}
          />
          <div className="lg:col-span-4 col-span-full">
            <div className="flex flex-col gap-1">
              <SubCompAssessmentForm
                onSubmitHandler={onAssessmentSubmitHandler}
                subComponent={
                  subComponents?.data[
                    activeSubComponentIndex
                  ] as unknown as SubComponent
                }
                isLoading={isSubComponentDataLoading}
              />
              <div className="flex w-full gap-4 justify-between mt-5">
                <Button
                  onClick={onGoToPrevAssessment}
                  disabled={isFirstSubcomponent || isSubComponentDataLoading}
                  variant="outline"
                  size="lg"
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubComponentDataLoading}
                  loading={answerAssessmentState.isPending}
                  onClick={onFormSubmitTriggerHandler}
                >
                  {isLastSubcomponent ? "Save" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
