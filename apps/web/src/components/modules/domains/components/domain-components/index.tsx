"use client";

import React from "react";

import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";

import { ListTypeColors } from "../../../domains-old/components-old/DomainCompCard";
import { useActiveList } from "../../providers/active-list/useActiveList";
import type { ModalRef } from "@etm/web-ui-components";
import { Modal, useToast } from "@etm/web-ui-components";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";

import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { Component } from "./domain-component";
import type {
  Component as IComponent,
  ComponentCreate,
} from "~/libs/models/component.model";
import { ComponentsSkeleton } from "./ComponentsSkeleton";
import { ComponentsEmptyPlaceHolder } from "./ComponentsEmptyPlaceHolder";
import type { ItemFormData } from "../form";
import { DomainComponentForm } from "../form";

interface Props {
  modalRef: React.RefObject<ModalRef | null>;
}
export function DomainComponents({ modalRef }: Props) {
  const { domainId, componentId } = useActiveList();
  const { toast } = useToast();

  const { data: components, ...componentsState } = useFindAll<IComponent>({
    path: `/domains/${domainId}/components`,
    tqOptions: {
      enabled: !!domainId,
      queryKey: ["components", domainId],
    },
  });

  const { mutate: createDomainComponent, ...createDomainComponentState } =
    useAddMutation<IComponent, ComponentCreate>("components");

  const onAddItemSubmitHandler = (values: ItemFormData) => {
    if (!domainId) return;
    createDomainComponent(
      {
        data: {
          name: values.name,
          code: values.code,
          description: values.description,
          domainId,
          translations: values.translations,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Component has been created successfully",
            variant: "success",
          });
          queryClient.invalidateQueries({
            queryKey: ["components"],
          });
          modalRef.current?.closeModal();
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-5 overflow-y-auto">
      {componentsState.isLoading && <ComponentsSkeleton />}

      {componentsState.isSuccess &&
      components?.total &&
      components?.total > 0 ? (
        <>
          {components?.data?.map((component) => (
            <div
              key={component.id}
              className="rounded-lg"
              style={{
                backgroundColor:
                  componentId === component.id
                    ? `${ListTypeColors.Component}`
                    : "",
              }}
            >
              <Component component={component} />
            </div>
          ))}
        </>
      ) : (
        !componentsState.isLoading && <ComponentsEmptyPlaceHolder />
      )}

      <Modal ref={modalRef} title={`Add Domain`}>
        <DomainComponentForm
          onSubmitHandler={onAddItemSubmitHandler}
          onCloseModal={() => modalRef.current?.closeModal()}
          loading={createDomainComponentState.isPending}
        />
      </Modal>
    </div>
  );
}
