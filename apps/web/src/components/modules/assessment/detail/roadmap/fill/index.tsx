"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { ComponentsList } from "./components/components-list";
import { SubCompRoadmapForm, SubCompRoadmapFormID } from "./components/form";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { Button, useToast } from "@etm/web-ui-components";
import { Stepper } from "./components/Stepper";
import type { Component } from "./components/components-list";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { SubComponent } from "~/libs/models/subComponent.model";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import type {
  FilledStatus,
  FilledSubComponent,
} from "../../current-assessment/fill";
import { PageTitle } from "./components/PageTitle";
import { PageSubTitle } from "./components/PageSubTitle";

export function RoadmapFill() {
  const params = useParams();

  const router = useRouter();

  const { toast } = useToast();

  const [activeComponent, setActiveComponent] = useState<Component>();

  const [activeSubComponentIndex, setActiveSubComponentIndex] =
    useState<number>(0);

  const [loading, setLoading] = useState(false);

  const { data: components, ...componentsState } = useFindAll<
    QueryManyResponse<{ id: string; name: string }>
  >({
    path: `/assessmentDomains/${params.roadmapDomainId as string}/components`,
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
    path: `/assessments/${params.id as string}/roadmaps/filled-status`,
  });

  const isFirstSubComponent = activeSubComponentIndex === 0;

  const isLastSubComponent =
    activeSubComponentIndex + 1 === subComponents?.data.length;

  const isSubComponentDataLoading =
    subComponentsState.isPending ||
    subComponentsState.isLoading ||
    subComponentsState.isFetching;

  const filledSubComponents: FilledSubComponent[] =
    (subComponents?.data as unknown as SubComponent[])?.map((subComp) => ({
      ...subComp,
      filled: (filledSubComps as unknown as FilledStatus)?.ids.includes(
        subComp.id
      ),
    })) || [];

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
      `${SubCompRoadmapFormID}`
    ) as HTMLFormElement;

    if (!form) return;

    form.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  const onRoadmapSubmitHandler = () => {
    filledSubCompsState.refetch();
    toast({
      title: "Success",
      message: "Roadmap has been filled successfully!",
      variant: "success",
    });
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
      pageTitle={<PageTitle assessmentId={params.id as string} />}
      includeBreadcrumb={false}
      onBack={onGoBackClickHandler}
    >
      <div className="flex flex-col gap-5 h-full w-full">
        <div className="flex w-full h-12 bg-basic-200 rounded-md px-5 py-3">
          <PageSubTitle
            domainId={params.roadmapDomainId as string}
            assessmentId={params.id as string}
          />
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
                <SubCompRoadmapForm
                  onSubmitting={setLoading}
                  onRoadmapSubmitHandler={onRoadmapSubmitHandler}
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
                  type="button"
                  size="lg"
                  disabled={
                    isFirstSubComponent || isSubComponentDataLoading || loading
                  }
                  onClick={() => onNavigateSubCompHandler("prev")}
                >
                  <Icon icon="hugeicons:previous" className="w-6 h-6" />
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubComponentDataLoading}
                    loading={loading}
                    onClick={onFormSubmitTriggerHandler}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    disabled={
                      isSubComponentDataLoading || loading || isLastSubComponent
                    }
                    onClick={() => onNavigateSubCompHandler("next")}
                  >
                    <Icon icon="hugeicons:next" className="w-6 h-6" />
                  </Button>
                </div>
              </div>
              <div className="justify-self-center absolute top-0 left-0 right-0 mx-auto z-10 w-full bg-dark-lighter/20 backdrop-blur-sm rounded-md rounded-b-none overflow-hidden px-2">
                <Stepper
                  steps={filledSubComponents}
                  activeStep={activeSubComponentIndex}
                  onStepClick={onNavigateSubCompHandler}
                  isDisabled={isSubComponentDataLoading || loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
