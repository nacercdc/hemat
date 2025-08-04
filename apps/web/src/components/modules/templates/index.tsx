"use client";

import React, { useRef } from "react";

import type { ModalRef } from "@etm/web-ui-components";
import { PageContainer } from "../components/PageContainer";
import ActiveListProvider from "./providers/active-list/ActiveListProvider";
import { useActiveList } from "./providers/active-list/useActiveList";

import { DomainCompCard } from "./components/DomainCompCard";
import { DomainsList } from "./components/domains";
import { DomainComponents } from "./components/domain-components";
import { DomainSubComponents } from "./components/domain-sub-components";

export function Templates() {
  return (
    <ActiveListProvider>
      <DomainListContent />
    </ActiveListProvider>
  );
}

export function DomainListContent() {
  const addDomainModalRef = useRef<ModalRef>(null);
  const addComponentModalRef = useRef<ModalRef>(null);
  const addSubComponentModalRef = useRef<ModalRef>(null);

  const { domainId: selectedDomainId, componentId: selectedComponentId } =
    useActiveList();

  return (
    <PageContainer pageTitle="Templates" includeBreadcrumb={false}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-0">
        <DomainCompCard
          cardListType="Domain"
          className="lg:rounded-l-lg"
          actionDisabled={false}
          onAddActionHandler={() => addDomainModalRef.current?.openModal()}
        >
          <DomainsList modalRef={addDomainModalRef} />
        </DomainCompCard>

        <DomainCompCard
          cardListType="Component"
          actionDisabled={!selectedDomainId}
          onAddActionHandler={() => addComponentModalRef.current?.openModal()}
        >
          <DomainComponents modalRef={addComponentModalRef} />
        </DomainCompCard>

        <DomainCompCard
          cardListType="SubComponent"
          className="lg:rounded-r-lg"
          actionDisabled={!selectedComponentId}
          onAddActionHandler={() =>
            addSubComponentModalRef.current?.openModal()
          }
        >
          <DomainSubComponents modalRef={addSubComponentModalRef} />
        </DomainCompCard>
      </div>
    </PageContainer>
  );
}
