"use client";

import React, { useEffect, useRef, useState } from "react";
import { DomainCompCard } from "./components/DomainCompCard";
import { components, domains, subComponents } from "./constants/DummyData";
import { DomainCompList } from "./components/DomainCompList";
import type { ModalRef } from "@etm/web-ui-components";
import { Modal } from "@etm/web-ui-components";
import type { ItemFormData } from "./components/form";
import { DomainComponentForm } from "./components/form";

//Temporary dummy Domain model
export interface Domain {
  id: string;
  name: string;
  code: string;
  description: string;
}

//Temporary dummy Component model
export interface Component {
  id: string;
  name: string;
  code: string;
  description: string;
  domainId: string;
}

//Temporary dummy SubComponent model
export interface SubComponent {
  id: string;
  name: string;
  code: string;
  description: string;
  componentId: string;
}

export type ListType = Domain[] | Component[] | SubComponent[];
export type ListTypeLabel = "Domain" | "Component" | "SubComponent";

export type ListItemType = Domain | Component | SubComponent;

export type ItemDetailType = Record<
  "componentCount" | "subcomponentCount",
  number
>;

export function Domains() {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [actionTypeLabel, setActionTypeLabel] =
    useState<ListTypeLabel>("Domain");
  const [selectedSubComponent, setSelectedSubComponent] =
    useState<SubComponent | null>(null);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [filteredSubComponents, setFilteredSubComponents] = useState<
    SubComponent[]
  >([]);

  const addItemModalRef = useRef<ModalRef>(null);

  const onDomainSelectHandler = (domain: ListItemType) => {
    setSelectedDomain(domain as Domain);
  };

  const onComponentSelectHandler = (component: ListItemType) => {
    setSelectedComponent(component as Component);
  };

  const onSubComponentSelectHandler = (subComponent: ListItemType) => {
    setSelectedSubComponent(subComponent as SubComponent);
  };

  const getDomainStats = (domain: ListItemType): Partial<ItemDetailType> => {
    const domainComponents = components.filter(
      (comp) => comp.domainId === domain.id
    );

    const componentIds = domainComponents.map((comp) => comp.id);

    const subcomponentCount = subComponents.filter((sub) =>
      componentIds.includes(sub.componentId)
    ).length;

    return {
      componentCount: domainComponents.length,
      subcomponentCount,
    };
  };

  const getComponentStats = (
    component: ListItemType
  ): Partial<ItemDetailType> => {
    const subcomponentCount = subComponents.filter(
      (sub) => sub.componentId === component.id
    ).length;

    return {
      subcomponentCount,
    };
  };

  const onAddItemTriggerHandler = (type: ListTypeLabel) => {
    setActionTypeLabel(type);
    addItemModalRef.current?.openModal();
  };

  const onAddItemSubmitHandler = (_values: ItemFormData) => {
    if (actionTypeLabel === "Component") {
      //TODO: grab the selected domain from state, merge and perform add component mutation
    }
    if (actionTypeLabel === "SubComponent") {
      //TODO: grab the selected component from state, merge and perform add subcomponent mutation
    }
    if (actionTypeLabel === "Domain") {
      //TODO: perform domain add mutation
    }
  };

  useEffect(() => {
    if (selectedDomain) {
      {
        setFilteredComponents(
          components.filter((comp) => comp.domainId === selectedDomain.id)
        );
        setFilteredSubComponents([]);
        setSelectedComponent(null);
      }
    }
  }, [selectedDomain]);

  useEffect(() => {
    if (selectedComponent) {
      setFilteredSubComponents(
        subComponents.filter(
          (subComp) => subComp.componentId === selectedComponent.id
        )
      );
    }
  }, [selectedComponent]);

  return (
    // TODO: This will be replace by the page container once its finalized
    <div className="flex flex-col gap-7 px-5 py-8 bg-white rounded-md h-[calc(100vh-120px)]">
      <h1 className="text-2xl font-bold">Domains</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-0 h-full">
        <div className="rounded-lg lg:rounded-tr-none lg:rounded-br-none border overflow-hidden h-full">
          <DomainCompCard
            cardListType="Domain"
            actionDisabled={false}
            onAddActionHandler={onAddItemTriggerHandler}
          >
            <DomainCompList
              list={domains}
              listType="Domain"
              selectedItem={selectedDomain}
              onSelectItem={onDomainSelectHandler}
              getItemDetails={getDomainStats}
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
              list={filteredComponents}
              listType="Component"
              selectedItem={selectedComponent}
              onSelectItem={onComponentSelectHandler}
              getItemDetails={getComponentStats}
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
              list={filteredSubComponents}
              listType="SubComponent"
              selectedItem={selectedSubComponent}
              onSelectItem={onSubComponentSelectHandler}
            />
          </DomainCompCard>
        </div>
      </div>

      <Modal ref={addItemModalRef} title={`Add ${actionTypeLabel}`}>
        <DomainComponentForm
          type={actionTypeLabel}
          onSubmitHandler={onAddItemSubmitHandler}
          onCloseModal={() => addItemModalRef.current?.closeModal()}
        />
      </Modal>
    </div>
  );
}
