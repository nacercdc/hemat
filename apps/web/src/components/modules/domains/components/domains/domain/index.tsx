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
import type { Domain, DomainEdit } from "~/libs/models/domain.model";

import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { useActiveList } from "../../../providers/active-list/useActiveList";
import { DomainComponentForm } from "~/components/modules/domains-old/components-old/form";
import type { ItemFormData } from "~/components/modules/domains-old/components-old/form";
import DomainDetail from "./domain-detail";
interface Props {
  domain: Domain;
}
export function Domain({ domain }: Props) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const editItemModalRef = useRef<ModalRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);
  const { toast } = useToast();
  const { setDomainId } = useActiveList();

  const { mutate: editDomain, ...editDomainState } = usePutMutation<
    Domain,
    DomainEdit
  >(`domains/${domain?.id}`);

  const { mutate: deleteDomain, ...deleteDomainState } = useDeleteMutation(
    `domains/${domain?.id}`
  );

  const onDomainSelectHandler = () => {
    setDomainId(domain.id);
  };

  const onEditItemSubmitHandler = (values: ItemFormData) => {
    editDomain(
      {
        data: {
          id: domain.id,
          name: values.name,
          code: values.code,
          description: values.description,
          translations: values.translations,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Domain updated successfully",
            variant: "success",
          });
          queryClient.invalidateQueries({
            queryKey: ["domains"],
          });
          editItemModalRef.current?.closeModal();
        },
      }
    );
  };

  const onDeleteHandler = () => {
    deleteDomain(
      {},
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Domain deleted successfully",
            variant: "success",
          });
          queryClient.invalidateQueries({
            queryKey: ["domains"],
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
        onClick={onDomainSelectHandler}
      >
        <h5 className="text-sm font-medium">{domain?.name}</h5>
        <Button type="button" variant="ghost">
          <Icon
            icon="ion:chevron-back-outline"
            className="!w-4 !h-4 !text-dark rotate-180"
          />
        </Button>
      </div>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        {drawerOpen && <DomainDetail id={domain.id} />}
      </Drawer>
      <Modal ref={editItemModalRef} title={`Edit Domain`}>
        <DomainComponentForm
          item={domain}
          onSubmitHandler={onEditItemSubmitHandler}
          onCloseModal={() => editItemModalRef.current?.closeModal()}
          loading={editDomainState.isPending}
        />
      </Modal>
      <Dialog
        ref={deleteDialogRef}
        title={`Delete Domain`}
        actionLabel="Delete"
        actionVariant="destructive"
        onAction={onDeleteHandler}
        autoClosable={false}
        actionLoading={deleteDomainState.isPending}
      >
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            Are you sure you want to delete this domain? This action cannot be
            undone.
          </span>
          <span className="text-destructive-500 font-normal text-sm">
            Warning: This domain may have components and sub-components .
            Deleting it will also delete all its children.
          </span>
        </div>
      </Dialog>
    </div>
  );
}
