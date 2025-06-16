"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  Dialog,
  Drawer,
  DropdownMenu,
  Modal,
} from "@etm/web-ui-components";
import { DomainComponentForm } from "./form";

import type { DialogRef, ModalRef } from "@etm/web-ui-components";
import type { ListItemType, ListTypeLabel } from "..";
import type { ItemFormData } from "./form";
import type { Domain, DomainEdit } from "~/libs/models/domain.model";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import type { Component, ComponentEdit } from "~/libs/models/component.model";
import type {
  SubComponent,
  SubComponentEdit,
} from "~/libs/models/subComponent.model";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import ItemDetails from "./ItemDetails";
// import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";

interface Props {
  itemId: string;
  type: ListTypeLabel;
  onClick?: (item: string) => void;
  // getDetails?: (item: ListItemType) => Partial<ItemDetailType>;
  refetchList?: (type: ListTypeLabel) => void;
}

export function DomainCompListItem({
  itemId,
  type,
  onClick,
  refetchList,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const editItemModalRef = useRef<ModalRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);

  // const { mutate: deleteScale, ...deleteScaleState } = useDeleteMutation<Scale>(
  //     `measurement-scales/${scale.id}`
  //   );

  const { mutate: editDomain, ...editDomainState } = usePutMutation<
    Domain,
    DomainEdit
  >(`domains/${itemId}`);

  const { mutate: editComponent, ...editComponentState } = usePutMutation<
    Component,
    ComponentEdit
  >(`components/${itemId}`);

  const { mutate: editSubComponent, ...editSubComponentState } = usePutMutation<
    SubComponent,
    SubComponentEdit
  >(`sub-components/${itemId}`);

  const { data: domain, ..._domainState } = useFindById<Domain>({
    path: `/domains/${itemId}`,
    tqOptions: {
      enabled: !!itemId && type === "Domain",
      queryKey: ["Domain", itemId],
    },
  });

  const { data: component, ..._componentState } = useFindById<Component>({
    path: `/components/${itemId}`,
    tqOptions: {
      enabled: !!itemId && type === "Component",
      queryKey: ["Component", itemId],
    },
  });
  const { data: subComponent, ..._subComponentState } =
    useFindById<SubComponent>({
      path: `/sub-components/${itemId}`,
      tqOptions: {
        enabled: !!itemId && type === "SubComponent",
        queryKey: ["SubComponent", itemId],
      },
    });

  const item: ListItemType | undefined = domain || component || subComponent;

  const onDeleteScaleHandler = () => {
    // deleteScale(
    //   {},
    //   {
    //     onSuccess: () => {
    //       deleteDialogRef.current?.closeDialog();
    //       onRefetch?.();
    //       toast({
    //         title: "Success",
    //         message: "Scale has been deleted successfully.",
    //       });
    //     },
    //   }
    // );
  };

  const onEditItemSubmitHandler = (values: ItemFormData) => {
    if (type === "SubComponent" && subComponent) {
      editSubComponent(
        {
          data: {
            id: itemId,
            name: values.name,
            code: values.code,
            description: values.description,
            componentId: subComponent.componentId,
            translations: values.translations,
          },
        },
        {
          onSuccess: () => {
            refetchList?.("SubComponent");
            editItemModalRef.current?.closeModal();
          },
        }
      );
    }
    if (type === "Component" && component) {
      editComponent(
        {
          data: {
            id: itemId,
            name: values.name,
            code: values.code,
            description: values.description,
            domainId: component.domainId,
            translations: values.translations,
          },
        },
        {
          onSuccess: () => {
            refetchList?.("Component");
            editItemModalRef.current?.closeModal();
          },
        }
      );
    }
    if (type === "Domain" && domain) {
      editDomain(
        {
          data: {
            id: itemId,
            name: values.name,
            code: values.code,
            description: values.description,
            translations: values.translations,
          },
        },
        {
          onSuccess: () => {
            refetchList?.("Domain");
            editItemModalRef.current?.closeModal();
          },
        }
      );
    }
  };

  return (
    <div className="w-full flex items-center gap-5 rounded-lg border px-3">
      <DropdownMenu
        triggerTextAlign="center"
        align="center"
        trigger={
          <Icon
            icon="ph:dots-three-outline-fill"
            className="!w-4 !h-4 !text-dark rotate-90"
            onClick={(e) => e.stopPropagation()}
          />
        }
        options={[
          {
            value: "view",
            label: "View",
            leftNode: (
              <Icon icon="solar:eye-outline" className="!text-dark !w-4 !h-4" />
            ),
            onClick: () => {
              setDrawerOpen(true);
            },
          },
          {
            value: "edit",
            label: "Edit",
            leftNode: (
              <Icon
                icon="iconamoon:edit-light"
                className="!text-dark !w-4 !h-4"
              />
            ),
            onClick: () => {
              editItemModalRef.current?.openModal();
            },
          },
          {
            value: "delete",
            label: "Delete",
            leftNode: (
              <Icon
                icon="material-symbols-light:delete-outline"
                className="!text-dark !w-4 !h-4"
              />
            ),
            onClick: () => deleteDialogRef.current?.openDialog(),
          },
        ]}
      />
      <div
        className="flex items-center justify-between w-full gap-5 cursor-pointer"
        onClick={() => onClick?.(itemId)}
      >
        <h5 className="text-sm font-medium">{item?.name}</h5>
        <Button type="button" variant="ghost">
          <Icon
            icon="ion:chevron-back-outline"
            className="!w-4 !h-4 !text-dark rotate-180"
          />
        </Button>
      </div>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <ItemDetails itemId={itemId} type={type} isOpen={!!drawerOpen} />
      </Drawer>
      <Modal ref={editItemModalRef} title={`Edit ${type}`}>
        <DomainComponentForm
          type={type}
          onSubmitHandler={onEditItemSubmitHandler}
          onCloseModal={() => editItemModalRef.current?.closeModal()}
          item={item}
          loading={
            editDomainState.isPending ||
            editComponentState.isPending ||
            editSubComponentState.isPending
          }
        />
      </Modal>
      <Dialog
        ref={deleteDialogRef}
        title="Delete Scale"
        actionLabel="Delete"
        actionVariant="destructive"
        onAction={onDeleteScaleHandler}
        autoClosable={false}
        // actionLoading={deleteScaleState.isPending}
      >
        Are you sure you want to delete this item? This action cannot be undone.
      </Dialog>
    </div>
  );
}
