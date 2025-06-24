"use client";

import React, { useRef } from "react";

import type { ModalRef } from "@etm/web-ui-components";
import type { Domain } from "~/libs/models/domain.model";
import type { Component } from "~/libs/models/component.model";
import type { SubComponent } from "~/libs/models/subComponent.model";
import { PageContainer } from "../components/PageContainer";
import ActiveListProvider from "../domains/providers/active-list/ActiveListProvider";
import { useActiveList } from "../domains/providers/active-list/useActiveList";
import DomainSubComponents from "../domains/components/domain-sub-components";
import { DomainCompCard } from "../domains/components/DomainCompCard";
import { Domains } from "../domains/components/domains";
import { DomainComponents } from "../domains/components/domain-components";

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

export function DomainList() {
  const addDomainModalRef = useRef<ModalRef>(null);
  const addComponentModalRef = useRef<ModalRef>(null);
  const addSubComponentModalRef = useRef<ModalRef>(null);

  const { domainId: selectedDomainId, componentId: selectedComponentId } =
    useActiveList();

  return (
    <ActiveListProvider>
      <PageContainer pageTitle="Domains" includeBreadcrumb={false}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-0 h-full">
          <div className="rounded-lg lg:rounded-tr-none lg:rounded-br-none border overflow-hidden h-full">
            <DomainCompCard
              cardListType="Domain"
              actionDisabled={false}
              onAddActionHandler={() => addDomainModalRef.current?.openModal()}
            >
              <Domains modalRef={addDomainModalRef} />
            </DomainCompCard>
          </div>

          <div className="border rounded-lg lg:rounded-none lg:border-t lg:border-b overflow-hidden">
            <DomainCompCard
              cardListType="Component"
              actionDisabled={!selectedDomainId}
              onAddActionHandler={() =>
                addComponentModalRef.current?.openModal()
              }
            >
              <DomainComponents modalRef={addComponentModalRef} />
            </DomainCompCard>
          </div>

          <div className="rounded-lg lg:rounded-tl-none lg:rounded-bl-none border overflow-hidden">
            <DomainCompCard
              cardListType="SubComponent"
              actionDisabled={!selectedComponentId}
              onAddActionHandler={() =>
                addSubComponentModalRef.current?.openModal()
              }
            >
              <DomainSubComponents />
            </DomainCompCard>
          </div>
        </div>
      </PageContainer>
    </ActiveListProvider>
  );
}
