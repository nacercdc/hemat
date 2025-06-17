"use client";

import React, { useRef, useState } from "react";
import { DomainCompCard } from "./components/DomainCompCard";

import type { ModalRef } from "@etm/web-ui-components";
import { Modal } from "@etm/web-ui-components";
import type { ItemFormData } from "./components/form";
import { DomainComponentForm } from "./components/form";
import type { Domain, DomainCreate } from "~/libs/models/domain.model";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { DomainCompList } from "./components/DomainCompList";
import type { Component, ComponentCreate } from "~/libs/models/component.model";
import type {
  SubComponent,
  SubComponentCreate,
} from "~/libs/models/subComponent.model";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { PageContainer } from "../components/PageContainer";

export type ListType = Domain[] | Component[] | SubComponent[];
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

  const { data: domains, ...domainsState } = useFindAll<
    QueryManyResponse<Domain>
  >({
    path: "/domains",
  });

  const { data: components, ...componentsState } = useFindAll<
    QueryManyResponse<Component>
  >({
    path: `/domains/${selectedDomain}/components`,
    tqOptions: {
      enabled: !!selectedDomain,
      queryKey: ["components", selectedDomain],
    },
  });

  const { data: subComponents, ...subComponentsState } = useFindAll<
    QueryManyResponse<SubComponent>
  >({
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

  const domainsData = (domains?.data as unknown as Domain[]) ?? [];
  const componentsData = (components?.data as unknown as Component[]) ?? [];
  const subComponentsData =
    (subComponents?.data as unknown as SubComponent[]) ?? [];

  const onDomainSelectHandler = (domainId: string) => {
    setSelectedDomain(domainId);
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
    if (actionTypeLabel === "SubComponent" && selectedComponent) {
      createSubComponent(
        {
          data: {
            name: values.name,
            code: values.code,
            description: values.description,
            componentId: selectedComponent,
            translations: values.translations,
          },
        },
        {
          onSuccess: () => {
            subComponentsState.refetch();
            addItemModalRef.current?.closeModal();
          },
        }
      );
    }
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
            addItemModalRef.current?.closeModal();
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
              list={domainsData}
              listType="Domain"
              selectedItem={selectedDomain}
              onSelectItem={onDomainSelectHandler}
              refetchList={refetchListHandler}
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
              list={componentsData}
              listType="Component"
              selectedItem={selectedComponent}
              onSelectItem={onComponentSelectHandler}
              refetchList={refetchListHandler}
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
              list={subComponentsData}
              listType="SubComponent"
              selectedItem={selectedSubComponent}
              onSelectItem={onSubComponentSelectHandler}
              refetchList={refetchListHandler}
            />
          </DomainCompCard>
        </div>
      </div>

      <Modal ref={addItemModalRef} title={`Add ${actionTypeLabel}`}>
        <DomainComponentForm
          loading={
            createDomainState.isPending ||
            createComponentState.isPending ||
            createSubComponentState.isPending
          }
          type={actionTypeLabel}
          onSubmitHandler={onAddItemSubmitHandler}
          onCloseModal={() => addItemModalRef.current?.closeModal()}
        />
      </Modal>
    </PageContainer>
  );
}
