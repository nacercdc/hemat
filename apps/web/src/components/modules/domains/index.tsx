"use client";

import React, { useRef, useState } from "react";
import { DomainCompCard } from "./components/DomainCompCard";

import type { ModalRef } from "@etm/web-ui-components";
import { Modal, useToast } from "@etm/web-ui-components";
import { DomainComponentForm } from "./components/form";
import type { Domain, DomainCreate } from "~/libs/models/domain.model";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { DomainCompList } from "./components/DomainCompList";
import type { Component, ComponentCreate } from "~/libs/models/component.model";
import type {
  SubComponent,
  SubComponentCreate,
  SubComponentMeasurementScale,
  SubComponentMeasurementScaleCreate,
} from "~/libs/models/subComponent.model";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { PageContainer } from "../components/PageContainer";
import { SubComponentForm } from "./components/form/subComponents";
import type { ItemFormData } from "./components/form";
import type { ScalesFormData } from "./components/form/subComponents/ScalesForm";
import type { DefaultFieldsFormData } from "./components/form/subComponents/DefaultFieldsForm";

export type ListType = Domain[] | Component[] | SubComponent[] | [];
export type ListTypeLabel = "Domain" | "Component" | "SubComponent";

export type ListItemType = (Domain | Component | SubComponent | null) & {
  componentsCount?: number;
  subComponentsCount?: number;
};

export type ItemDetailType = Record<
  "componentCount" | "subComponentCount",
  number
>;

export function Domains() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [selectedSubComponent, setSelectedSubComponent] = useState<
    string | null
  >(null);
  const [actionTypeLabel, setActionTypeLabel] =
    useState<ListTypeLabel>("Domain");

  const addItemModalRef = useRef<ModalRef>(null);
  const { toast } = useToast();

  const { data: domains, ...domainsState } = useFindAll<Domain>({
    path: "/domains",
  });

  const { data: components, ...componentsState } = useFindAll<Component>({
    path: `/domains/${selectedDomain}/components`,
    tqOptions: {
      enabled: !!selectedDomain,
      queryKey: ["components", selectedDomain],
    },
  });

  const { data: subComponents, ...subComponentsState } =
    useFindAll<SubComponent>({
      path: `/components/${selectedComponent}/subComponents`,
      tqOptions: {
        enabled: !!selectedComponent,
        queryKey: ["subComponents", selectedComponent],
      },
    });

  const { mutate: createDomain, ...createDomainState } = useAddMutation<
    Domain,
    DomainCreate
  >("domains");

  const { mutate: createComponent, ...createComponentState } = useAddMutation<
    Component,
    ComponentCreate
  >("components");

  const { mutate: createSubComponent, ...createSubComponentState } =
    useAddMutation<SubComponent, SubComponentCreate>("sub-components");

  const {
    mutate: createSubComponentMeasurementScales,
    ...createSubComponentMeasurementScalesState
  } = useAddMutation<
    SubComponentMeasurementScale[],
    SubComponentMeasurementScaleCreate[]
  >(`sub-components/${selectedSubComponent}/measurement-scales`);

  const filteredComponents = components?.data.filter(
    (component) => component.domainId === selectedDomain
  );

  const filteredSubComponents = subComponents?.data.filter(
    (subComponent) => subComponent.componentId === selectedComponent
  );

  const onDomainSelectHandler = (domainId: string) => {
    setSelectedDomain(domainId);
    setSelectedComponent(null);
  };

  const onComponentSelectHandler = (componentID: string) => {
    setSelectedComponent(componentID);
  };

  const onSubComponentSelectHandler = (subComponentID: string) => {
    setSelectedSubComponent(subComponentID);
  };

  const refetchListHandler = (listType: ListTypeLabel) => {
    if (listType === "Domain") {
      domainsState.refetch();
    } else if (listType === "Component" && selectedDomain) {
      componentsState.refetch();
    } else if (listType === "SubComponent" && selectedComponent) {
      subComponentsState.refetch();
    }
  };

  const onAddItemTriggerHandler = (type: ListTypeLabel) => {
    setActionTypeLabel(type);
    addItemModalRef.current?.openModal();
  };

  const onAddItemSubmitHandler = (values: ItemFormData) => {
    if (actionTypeLabel === "Component" && selectedDomain) {
      createComponent(
        {
          data: {
            name: values.name,
            code: values.code,
            description: values.description,
            domainId: selectedDomain,
            translations: values.translations,
          },
        },
        {
          onSuccess: () => {
            componentsState.refetch();
            addItemModalRef.current?.closeModal();
          },
        }
      );
    }
    if (actionTypeLabel === "Domain") {
      createDomain(
        {
          data: {
            name: values.name,
            code: values.code,
            description: values.description,
            translations: values.translations,
          },
        },
        {
          onSuccess: () => {
            domainsState.refetch();
            addItemModalRef.current?.closeModal();
          },
        }
      );
    }
  };

  const onAddSubComponentSubmitHandler = (values: DefaultFieldsFormData) => {
    if (selectedComponent) {
      createSubComponent(
        {
          data: {
            name: values.name,
            code: values.code,
            description: values.description,
            componentId: selectedComponent,
            translations: values.translations ?? {},
          },
        },
        {
          onSuccess: (data) => {
            setSelectedSubComponent(data.id);
            toast({
              title: "Success",
              message: "Sub Component created successfully",
              variant: "success",
            });

            subComponentsState.refetch();
          },
        }
      );
    }
  };
  const onAddScalesSubmitHandler = (values: ScalesFormData) => {
    if (selectedComponent) {
      createSubComponentMeasurementScales(
        {
          data: values.scales.map((scale) => ({
            subComponentId: selectedSubComponent ?? "",
            measurementScaleId: scale.measurementScaleId ?? "",
            description: scale.description ?? "",
            translations: scale.translations ?? {},
          })),
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              message: "Sub Component measurement scale created successfully",
              variant: "success",
            });

            subComponentsState.refetch();
          },
        }
      );
    }
  };

  return (
    <PageContainer pageTitle="Domains" includeBreadcrumb={false}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-0 h-full">
        <div className="rounded-lg lg:rounded-tr-none lg:rounded-br-none border overflow-hidden h-full">
          <DomainCompCard
            cardListType="Domain"
            actionDisabled={false}
            onAddActionHandler={onAddItemTriggerHandler}
          >
            <DomainCompList
              list={domains?.data ?? []}
              listType="Domain"
              selectedItem={selectedDomain}
              onSelectItem={onDomainSelectHandler}
              refetchList={refetchListHandler}
              isLoading={domainsState.isLoading}
            />
          </DomainCompCard>
        </div>

        <div className="border rounded-lg lg:rounded-none lg:border-t lg:border-b overflow-hidden">
          <DomainCompCard
            cardListType="Component"
            actionDisabled={!selectedDomain}
            onAddActionHandler={onAddItemTriggerHandler}
          >
            <DomainCompList
              list={filteredComponents ?? []}
              listType="Component"
              selectedItem={selectedComponent}
              onSelectItem={onComponentSelectHandler}
              refetchList={refetchListHandler}
              parentId={selectedDomain}
            />
          </DomainCompCard>
        </div>

        <div className="rounded-lg lg:rounded-tl-none lg:rounded-bl-none border overflow-hidden">
          <DomainCompCard
            cardListType="SubComponent"
            actionDisabled={!selectedComponent}
            onAddActionHandler={onAddItemTriggerHandler}
          >
            <DomainCompList
              list={filteredSubComponents ?? []}
              listType="SubComponent"
              selectedItem={selectedSubComponent}
              onSelectItem={onSubComponentSelectHandler}
              refetchList={refetchListHandler}
              parentId={selectedComponent}
            />
          </DomainCompCard>
        </div>
      </div>

      <Modal ref={addItemModalRef} title={`Add ${actionTypeLabel}`}>
        {actionTypeLabel === "SubComponent" ? (
          <SubComponentForm
            onScalesSubmit={onAddScalesSubmitHandler}
            subComponentId={selectedSubComponent}
            loading={
              createSubComponentState.isPending ||
              createSubComponentMeasurementScalesState.isPending
            }
            onDefaultFieldsSubmit={onAddSubComponentSubmitHandler}
            onCloseModal={() => addItemModalRef.current?.closeModal()}
          />
        ) : (
          <DomainComponentForm
            onSubmitHandler={onAddItemSubmitHandler}
            onCloseModal={() => addItemModalRef.current?.closeModal()}
            loading={
              createDomainState.isPending || createComponentState.isPending
            }
          />
        )}
      </Modal>
    </PageContainer>
  );
}
