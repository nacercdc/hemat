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
import { DomainComponentForm } from "./form";
import type { DialogRef, ModalRef } from "@etm/web-ui-components";
import type { ListItemType, ListTypeLabel } from "..";
import type { ItemFormData } from "./form";
import type { Domain, DomainEdit } from "~/libs/models/domain.model";
import type { Component, ComponentEdit } from "~/libs/models/component.model";
import type {
  SubComponent,
  SubComponentEdit,
  SubComponentMeasurementScale,
  SubComponentMeasurementScaleCreate,
} from "~/libs/models/subComponent.model";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import ItemDetails from "./ItemDetails";
import { SubComponentForm } from "./form/subComponents";
import type { DefaultFieldsFormData } from "./form/subComponents/DefaultFieldsForm";
import type { ScalesFormData } from "./form/subComponents/ScalesForm";

interface Props {
  item: ListItemType;
  type: ListTypeLabel;
  onClick?: (item: string) => void;
  refetchList?: (type: ListTypeLabel) => void;
  parentId?: string;
}

export function DomainCompListItem({
  item,
  type,
  onClick,
  refetchList,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const editItemModalRef = useRef<ModalRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);
  const { toast } = useToast();

  const { mutate: editDomain, ...editDomainState } = usePutMutation<
    Domain,
    DomainEdit
  >(`domains/${item?.id}`);

  const { mutate: editComponent, ...editComponentState } = usePutMutation<
    Component,
    ComponentEdit
  >(`components/${item?.id}`);

  const { mutate: editSubComponent, ...editSubComponentState } = usePutMutation<
    SubComponent,
    SubComponentEdit
  >(`sub-components/${item?.id}`);

  const {
    mutate: editSubComponentMeasurementScales,
    ...editSubComponentMeasurementScalesState
  } = usePutMutation<
    SubComponentMeasurementScale[],
    SubComponentMeasurementScaleCreate[]
  >(`sub-components/${item.id}/measurement-scales`);

  const { mutate: deleteDomain } = useDeleteMutation(`domains/${item?.id}`);
  const { mutate: deleteComponent } = useDeleteMutation(
    `components/${item?.id}`
  );
  const { mutate: deleteSubComponent } = useDeleteMutation(
    `sub-components/${item?.id}`
  );

  const { data: domain, ...domainState } = useFindById<Domain>({
    path: `/domains/${item?.id}`,
    tqOptions: {
      enabled: !!item?.id && type === "Domain" && drawerOpen,
      queryKey: ["Domain", item?.id],
    },
  });

  const { data: component, ...componentState } = useFindById<Component>({
    path: `/components/${item?.id}`,
    tqOptions: {
      enabled: !!item?.id && type === "Component" && drawerOpen,
      queryKey: ["Component", item?.id],
    },
  });

  const { data: subComponent, ...subComponentState } =
    useFindById<SubComponent>({
      path: `/sub-components/${item?.id}`,
      tqOptions: {
        enabled: !!item?.id && type === "SubComponent" && drawerOpen,
        queryKey: ["SubComponent", item?.id],
      },
    });

  const onEditItemSubmitHandler = (values: ItemFormData) => {
    if (type === "Component" && item) {
      editComponent(
        {
          data: {
            id: item.id,
            name: values.name,
            code: values.code,
            description: values.description,
            domainId: (item as Component).domainId,
            translations: values.translations,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              message: "Component updated successfully",
              variant: "success",
            });
            refetchList?.("Component");
            editItemModalRef.current?.closeModal();
          },
        }
      );
    }
    if (type === "Domain" && item) {
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
            toast({
              title: "Success",
              message: "Domain updated successfully",
              variant: "success",
            });
            refetchList?.("Domain");
            editItemModalRef.current?.closeModal();
          },
        }
      );
    }
  };

  const onEditSubComponentSubmitHandler = (values: DefaultFieldsFormData) => {
    if (type === "SubComponent" && item) {
      editSubComponent(
        {
          data: {
            id: item.id,
            name: values.name,
            code: values.code,
            description: values.description,
            componentId: (item as SubComponent).componentId,
            translations: values.translations ?? {},
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              message: "Sub Component updated successfully",
              variant: "success",
            });
            refetchList?.("SubComponent");
          },
        }
      );
    }
  };

  const onEditScalesSubmitHandler = (values: ScalesFormData) => {
    if (item) {
      editSubComponentMeasurementScales(
        {
          data: values.scales.map((scale) => ({
            subComponentId: item.id ?? "",
            measurementScaleId: scale.measurementScaleId ?? "",
            description: scale.description ?? "",
            translations: scale.translations ?? {},
          })),
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              message: "Sub Component measurement scale updated successfully",
              variant: "success",
            });
            refetchList?.("SubComponent");
            editItemModalRef.current?.closeModal();
          },
        }
      );
    }
  };

  const onDeleteHandler = () => {
    if (type === "SubComponent") {
      deleteSubComponent(
        {},
        {
          onSuccess: () => {
            toast({
              title: "Success",
              message: "Sub Component deleted successfully",
              variant: "success",
            });
            refetchList?.("SubComponent");
            deleteDialogRef.current?.closeDialog();
          },
        }
      );
    }
    if (type === "Component") {
      deleteComponent(
        {},
        {
          onSuccess: () => {
            toast({
              title: "Success",
              message: "Component deleted successfully",
              variant: "success",
            });
            refetchList?.("Component");
            deleteDialogRef.current?.closeDialog();
          },
        }
      );
    }
    if (type === "Domain") {
      deleteDomain(
        {},
        {
          onSuccess: () => {
            toast({
              title: "Success",
              message: "Domain deleted successfully",
              variant: "success",
            });
            refetchList?.("Domain");
            deleteDialogRef.current?.closeDialog();
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
        onClick={() => onClick?.(item?.id ?? "")}
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
        {drawerOpen && (
          <ItemDetails
            type={type}
            item={
              domain || component || (subComponent as unknown as ListItemType)
            }
            isLoading={
              domainState.isPending ||
              componentState.isPending ||
              subComponentState.isPending
            }
          />
        )}
      </Drawer>
      <Modal ref={editItemModalRef} title={`Edit ${type}`}>
        {type === "SubComponent" ? (
          <SubComponentForm
            onScalesSubmit={onEditScalesSubmitHandler}
            subComponentId={item.id}
            item={item as unknown as SubComponent}
            loading={
              editSubComponentState.isPending ||
              editSubComponentMeasurementScalesState.isPending
            }
            onDefaultFieldsSubmit={onEditSubComponentSubmitHandler}
            onCloseModal={() => editItemModalRef.current?.closeModal()}
          />
        ) : (
          <DomainComponentForm
            item={item}
            onSubmitHandler={onEditItemSubmitHandler}
            onCloseModal={() => editItemModalRef.current?.closeModal()}
            loading={editDomainState.isPending || editComponentState.isPending}
          />
        )}
      </Modal>
      <Dialog
        ref={deleteDialogRef}
        title={`Delete ${type}`}
        actionLabel="Delete"
        actionVariant="destructive"
        onAction={onDeleteHandler}
        autoClosable={false}
      >
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            Are you sure you want to delete this {type.toLowerCase()}? This
            action cannot be undone.
          </span>
          {type !== "SubComponent" && (
            <span className="text-destructive-500 font-normal text-sm">
              Warning: This {type.toLowerCase()} may have{" "}
              {type === "Domain"
                ? "components and sub-components"
                : "sub-components"}
              . Deleting it will also delete all its children.
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
