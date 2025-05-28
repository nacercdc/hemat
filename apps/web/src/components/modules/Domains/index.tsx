"use client";

import React, { useEffect, useState } from "react";
import type { ListItemType } from "./components/DomainCompCard";
import { DomainCompCard } from "./components/DomainCompCard";
import { components, domains, subComponents } from "./constants/DummyData";

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

export function Domains() {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [selectedSubComponent, setSelectedSubComponent] =
    useState<SubComponent | null>(null);

  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [filteredSubComponents, setFilteredSubComponents] = useState<
    SubComponent[]
  >([]);

  const onDomainSelectHandler = (domain: ListItemType) => {
    setSelectedDomain(domain as Domain);
  };

  const onComponentSelectHandler = (component: ListItemType) => {
    setSelectedComponent(component as Component);
  };

  const onSubComponentSelectHandler = (subComponent: ListItemType) => {
    setSelectedSubComponent(subComponent as SubComponent);
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
            cardType="Domain"
            list={domains}
            selectedListItem={selectedDomain}
            actionDisabled={false}
            onAddActionHandler={() => console.log("Add Domain Clicked!!")}
            onListItemSelectHandler={onDomainSelectHandler}
          />
        </div>

        <div className="border rounded-lg lg:rounded-none lg:border-t lg:border-b overflow-hidden">
          <DomainCompCard
            cardType="Component"
            list={filteredComponents}
            actionDisabled={!selectedDomain}
            selectedListItem={selectedComponent}
            onAddActionHandler={() => console.log("Add Component Clicked!!")}
            onListItemSelectHandler={onComponentSelectHandler}
          />
        </div>

        <div className="rounded-lg lg:rounded-tl-none lg:rounded-bl-none border overflow-hidden">
          <DomainCompCard
            cardType="Sub-Component"
            list={filteredSubComponents}
            actionDisabled={!selectedComponent}
            selectedListItem={selectedSubComponent}
            onAddActionHandler={() =>
              console.log("Add Sub-Component Clicked!!")
            }
            onListItemSelectHandler={onSubComponentSelectHandler}
          />
        </div>
      </div>
    </div>
  );
}
