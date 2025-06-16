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
import type { ItemDetailType, ListItemType, ListTypeLabel } from "..";
import type { ItemFormData } from "./form";
import type { Domain, DomainEdit } from "~/libs/models/domain.model";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import type { Component, ComponentEdit } from "~/libs/models/component.model";
import type {
  SubComponent,
  SubComponentEdit,
} from "~/libs/models/subComponent.model";
// import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";

interface Props {
  item: ListItemType;
  type: ListTypeLabel;
  onClick?: (item: ListItemType) => void;
  getDetails?: (item: ListItemType) => Partial<ItemDetailType>;
  refetchList?: (type: ListTypeLabel) => void;
}

export function DomainCompListItem({
  item,
  type,
  onClick,
  getDetails,
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
  >(`domains/${item.id}`);

  const { mutate: editComponent, ...editComponentState } = usePutMutation<
    Component,
    ComponentEdit
  >(`components/${item.id}`);

  const { mutate: editSubComponent, ...editSubComponentState } = usePutMutation<
    SubComponent,
    SubComponentEdit
  >(`sub-components/${item.id}`);

  const itemDetails = getDetails?.(item);

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
    if (type === "SubComponent" && item) {
      editSubComponent(
        {
          data: {
            id: item.id,
            name: values.name,
            code: values.code,
            description: values.description,
            componentId: (item as unknown as SubComponent).componentId,
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
    if (type === "Component" && item) {
      editComponent(
        {
          data: {
            id: item.id,
            name: values.name,
            code: values.code,
            description: values.description,
            domainId: (item as unknown as Component).domainId,
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
    if (type === "Domain" && (item as unknown as Domain)) {
      editDomain(
        {
          data: {
            id: item.id,
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
        onClick={() => onClick?.(item)}
      >
        <h5 className="text-sm font-medium">{item.name}</h5>
        <Button type="button" variant="ghost">
          <Icon
            icon="ion:chevron-back-outline"
            className="!w-4 !h-4 !text-dark rotate-180"
          />
        </Button>
      </div>
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-info/10 text-info p-2 px-3 text-xs">
              Code: {item.code}
            </div>
            <h3 className="text-sm font-bold">{item.name}</h3>
          </div>
        }
        description={<span className="text-xs mt-5">{item.description}</span>}
      >
        {itemDetails && (
          <div className="border-[1px] rounded-md p-5 flex flex-col gap-5">
            {itemDetails.componentCount !== undefined && (
              <h6 className="text-xs font-medium">
                Components: {itemDetails.componentCount}
              </h6>
            )}
            {itemDetails.subComponentCount !== undefined && (
              <h6 className="text-xs font-medium">
                Sub-Components: {itemDetails.subComponentCount}
              </h6>
            )}
          </div>
        )}
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
