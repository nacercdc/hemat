"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  Dialog,
  Drawer,
  DropdownMenu,
  Modal,
  useToast,
} from "@etm/web-ui-components";
import type { DialogRef, ModalRef } from "@etm/web-ui-components";

import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { useActiveList } from "../../../providers/active-list/useActiveList";
import { DomainComponentForm } from "~/components/modules/domains-old/components-old/form";
import type { ItemFormData } from "~/components/modules/domains-old/components-old/form";
import type {
  ComponentEdit,
  Component as IComponent,
} from "~/libs/models/component.model";
import ComponentDetail from "./component-detail";
interface Props {
  component: IComponent;
}
export function Component({ component }: Props) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const editItemModalRef = useRef<ModalRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);
  const { toast } = useToast();
  const { domainId, setComponentId } = useActiveList();

  const { mutate: editComponent, ...editComponentState } = usePutMutation<
    IComponent,
    ComponentEdit
  >(`components/${component.id}`);

  const { mutate: deleteComponent, ...deleteComponentState } =
    useDeleteMutation(`components/${component.id}`);

  const onComponentSelectHandler = () => {
    setComponentId(component.id);
  };

  const onEditItemSubmitHandler = (values: ItemFormData) => {
    if (!domainId) return;
    editComponent(
      {
        data: {
          id: component.id,
          name: values.name,
          domainId,
          code: values.code,
          description: values.description,
          translations: values.translations,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Component has been updated successfully.",
            variant: "success",
          });
          queryClient.invalidateQueries({
            queryKey: ["components"],
          });
          editItemModalRef.current?.closeModal();
        },
      }
    );
  };

  const onDeleteHandler = () => {
    deleteComponent(
      {},
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Component has been deleted successfully.",
            variant: "success",
          });
          queryClient.invalidateQueries({
            queryKey: ["components"],
          });
          deleteDialogRef.current?.closeDialog();
        },
      }
    );
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
        onClick={onComponentSelectHandler}
      >
        <h5 className="text-sm font-medium">{component?.name}</h5>
        <Button type="button" variant="ghost">
          <Icon
            icon="ion:chevron-back-outline"
            className="!w-4 !h-4 !text-dark rotate-180"
          />
        </Button>
      </div>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        {drawerOpen && <ComponentDetail id={component.id} />}
      </Drawer>
      <Modal ref={editItemModalRef} title={`Edit Component`}>
        <DomainComponentForm
          item={component}
          onSubmitHandler={onEditItemSubmitHandler}
          onCloseModal={() => editItemModalRef.current?.closeModal()}
          loading={editComponentState.isPending}
        />
      </Modal>
      <Dialog
        ref={deleteDialogRef}
        title={`Delete Component`}
        actionLabel="Delete"
        actionVariant="destructive"
        onAction={onDeleteHandler}
        autoClosable={false}
        actionLoading={deleteComponentState.isPending}
      >
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            Are you sure you want to delete this component? This action cannot
            be undone.
          </span>
          <span className="text-destructive-500 font-normal text-sm">
            Warning: This component may have sub-components . Deleting it will
            also delete all its children.
          </span>
        </div>
      </Dialog>
    </div>
  );
}
