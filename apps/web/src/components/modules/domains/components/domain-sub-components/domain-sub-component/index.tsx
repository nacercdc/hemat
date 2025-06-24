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
import type {
  SubComponentEdit,
  SubComponent,
  SubComponentMeasurementScale,
  SubComponentMeasurementScaleCreate,
} from "~/libs/models/subComponent.model";
import ComponentDetail from "./sub-component-detail";
import { SubComponentForm } from "../../form/subComponents";
import type { DefaultFieldsFormData } from "../../form/subComponents/DefaultFieldsForm";
import type { ScalesFormData } from "../../form/subComponents/ScalesForm";

interface Props {
  subComponent: SubComponent;
}
export function SubComponent({ subComponent }: Props) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { setSubComponentId, subComponentId } = useActiveList();
  const editSubComponentModalRef = useRef<ModalRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);
  const { toast } = useToast();

  const { mutate: editSubComponent, ...editSubComponentState } = usePutMutation<
    SubComponent,
    SubComponentEdit
  >(`sub-components/${subComponentId}`);

  const {
    mutate: editSubComponentMeasurementScales,
    ...editSubComponentMeasurementScalesState
  } = usePutMutation<
    SubComponentMeasurementScale[],
    SubComponentMeasurementScaleCreate[]
  >(`sub-components/${subComponentId}/measurement-scales`);

  const { mutate: deleteSubComponent, ...deleteSubComponentState } =
    useDeleteMutation(`sub-components/${subComponentId}`);

  const onSubComponentSelectHandler = () => {
    setSubComponentId(subComponent.id);
  };

  const onEditSubComponentSubmitHandler = (values: DefaultFieldsFormData) => {
    editSubComponent(
      {
        data: {
          id: subComponent.id,
          name: values.name,
          code: values.code,
          description: values.description,
          componentId: subComponent.componentId,
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
          queryClient.invalidateQueries({
            queryKey: ["subComponents"],
          });
        },
      }
    );
  };

  const onEditScalesSubmitHandler = (values: ScalesFormData) => {
    if (subComponentId) {
      editSubComponentMeasurementScales(
        {
          data: values.scales.map((scale) => ({
            subComponentId: subComponentId ?? "",
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
            queryClient.invalidateQueries({
              queryKey: ["subComponents"],
            });
            editSubComponentModalRef.current?.closeModal();
          },
        }
      );
    }
  };

  const onDeleteHandler = () => {
    deleteSubComponent(
      {},
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Sub Component has been deleted successfully.",
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
              editSubComponentModalRef.current?.openModal();
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
        onClick={onSubComponentSelectHandler}
      >
        <h5 className="text-sm font-medium">{subComponent?.name}</h5>
        <Button type="button" variant="ghost">
          <Icon
            icon="ion:chevron-back-outline"
            className="!w-4 !h-4 !text-dark rotate-180"
          />
        </Button>
      </div>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        {drawerOpen && <ComponentDetail id={subComponent.id} />}
      </Drawer>
      <Modal ref={editSubComponentModalRef} title={`Edit Sub Component`}>
        <SubComponentForm
          item={subComponent}
          onDefaultFieldsSubmit={onEditSubComponentSubmitHandler}
          onScalesSubmit={onEditScalesSubmitHandler}
          onCloseModal={() => editSubComponentModalRef.current?.closeModal()}
          loading={
            editSubComponentState.isPending ||
            editSubComponentMeasurementScalesState.isPending
          }
        />
      </Modal>
      <Dialog
        ref={deleteDialogRef}
        title={`Delete Sub Component`}
        actionLabel="Delete"
        actionVariant="destructive"
        onAction={onDeleteHandler}
        autoClosable={false}
        actionLoading={deleteSubComponentState.isPending}
      >
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            Are you sure you want to delete this sub component? This action
            cannot be undone.
          </span>
        </div>
      </Dialog>
    </div>
  );
}
