/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import { useCallback, useEffect, useState } from "react";
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
import { Stepper } from "./components/Stepper";
import type { Component } from "./components/components-list";
import type { AssessmentFormData } from "./components/form";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { SubComponent } from "~/libs/models/subComponent.model";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";

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
  const { toast } = useToast();

  const [activeComponent, setActiveComponent] = useState<Component>();

  const [activeSubComponentIndex, setActiveSubComponentIndex] =
    useState<number>(0);

  //TODO: this will be replaced with our real assessment-segment from our path param
  const { mutate: answerAssessment, ...answerAssessmentState } = useAddMutation<
    { id: string; name: string },
    AssessmentFormData & {
      assessmentId: string;
      measurementScaleId: string;
      subComponentId: string;
      isPrimary: boolean;
    }
  >("assessments/e9989a40-722d-4541-b368-8c7ebab86013/answers");

  //TODO: this will be replaced with our real domain-segment from our path param
  const { data: components, ...componentsState } = useFindAll<
    QueryManyResponse<{ id: string; name: string }>
  >({
    path: "/assessmentDomains/588f3382-e7e1-474c-8e3f-67eb9de43eec/components",
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

  //TODO: this will be replaced with our real assessment-segment from our path param
  const { data: filledSubComps } = useFindById<QueryManyResponse<FilledStatus>>(
    {
      path: `/assessments/e9989a40-722d-4541-b368-8c7ebab86013/sub-components/filled-status`,
    }
  );

  const isFirstSubComponent = activeSubComponentIndex === 0;

  const isLastSubComponent =
    activeSubComponentIndex + 1 === subComponents?.data.length;

  const filledSubComponents: FilledSubComponent[] =
    (subComponents?.data as unknown as SubComponent[])?.map((subComp) => ({
      ...subComp,
      filled: (filledSubComps as unknown as FilledStatus)?.ids.includes(
        (subComponents?.data as unknown as SubComponent[])[
          activeSubComponentIndex
        ]!.id
      ),
    })) || [];

  const isSubComponentDataLoading =
    subComponentsState.isPending ||
    subComponentsState.isLoading ||
    subComponentsState.isFetching;

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
          assessmentId: "e9989a40-722d-4541-b368-8c7ebab86013",
          subComponentId: (
            subComponents?.data[
              activeSubComponentIndex
            ] as unknown as SubComponent
          ).id,
          isPrimary: true,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Assessment has been answered successfully!",
            variant: "success",
          });

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
              !filledSubComponents ||
              !(subComponents?.data as unknown as SubComponent[])
            }
            numberOfFilledSubs={filledSubComponents?.length || 0}
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
                  isLoading={isSubComponentDataLoading}
                />
              </div>
              <div className="flex w-full gap-4 justify-between mt-5 mb-20">
                <Button
                  onClick={() => onNavigateSubCompHandler("prev")}
                  disabled={isFirstSubComponent || isSubComponentDataLoading}
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
                  {isLastSubComponent ? "Save" : "Next"}
                </Button>
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
