"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
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
import type {
  SubComponentEdit,
  SubComponent,
  SubComponentMeasurementScale,
  SubComponentMeasurementScaleCreate,
} from "~/libs/models/subComponent.model";
import ComponentDetail from "./sub-component-detail";
import { SubComponentForm } from "../../form/subComponents";
import type { DefaultFieldsFormData } from "../../form/subComponents/DefaultFieldsForm";
import { ScalesForm } from "../../form/subComponents/ScalesForm";
import type { ScalesFormData } from "../../form/subComponents/ScalesForm";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";

interface Props {
  subComponent: SubComponent;
}
export function SubComponent({ subComponent }: Props) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const editSubComponentModalRef = useRef<ModalRef>(null);
  const addMeasurementScaleModalRef = useRef<ModalRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);
  const { toast } = useToast();

  const {
    mutate: createSubComponentMeasurementScales,
    ...createSubComponentMeasurementScalesState
  } = useAddMutation<
    SubComponentMeasurementScale[],
    SubComponentMeasurementScaleCreate[]
  >(`sub-components/${subComponent.id}/measurement-scales`);

  const { mutate: editSubComponent, ...editSubComponentState } = usePutMutation<
    SubComponent,
    SubComponentEdit
  >(`sub-components/${subComponent.id}`);

  const {
    mutate: editSubComponentMeasurementScales,
    ...editSubComponentMeasurementScalesState
  } = usePutMutation<
    SubComponentMeasurementScale[],
    SubComponentMeasurementScaleCreate[]
  >(`sub-components/${subComponent.id}/measurement-scales`);

  const { mutate: deleteSubComponent, ...deleteSubComponentState } =
    useDeleteMutation(`sub-components/${subComponent.id}`);

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

  const onAddScalesSubmitHandler = (values: ScalesFormData) => {
    if (subComponent.id) {
      createSubComponentMeasurementScales(
        {
          data: values.scales.map((scale) => ({
            subComponentId: subComponent.id ?? "",
            measurementScaleId: scale.measurementScaleId ?? "",
            description: scale.description ?? "",
            translations: scale.translations ?? {},
          })),
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              message: "Sub Component measurement scale created successfully",
              variant: "success",
            });

            queryClient.invalidateQueries({
              queryKey: ["subComponents"],
            });
            addMeasurementScaleModalRef.current?.closeModal();
          },
        }
      );
    }
  };

  const onEditScalesSubmitHandler = (values: ScalesFormData) => {
    if (subComponent.id) {
      editSubComponentMeasurementScales(
        {
          data: values.scales.map((scale) => ({
            subComponentId: scale.subComponentId ?? "",
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
          {
            value: "add-measurement-scale",
            label: "Add Measurement Scale",
            leftNode: (
              <Icon
                icon="iconamoon:edit-light"
                className="!text-dark !w-4 !h-4"
              />
            ),
            onClick: () => {
              addMeasurementScaleModalRef.current?.openModal();
            },
          },
        ]}
      />
      <div className="flex items-center justify-between w-full gap-5 ">
        <h5 className="text-sm font-medium">{subComponent?.name}</h5>
      </div>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        {drawerOpen && <ComponentDetail id={subComponent.id} />}
      </Drawer>
      <Modal ref={editSubComponentModalRef} title={`Edit sub component`}>
        <SubComponentForm
          subComponent={subComponent}
          onScalesSubmit={onEditScalesSubmitHandler}
          defaultFieldsLoading={editSubComponentState.isPending}
          onDefaultFieldsSubmit={onEditSubComponentSubmitHandler}
          scalesLoading={editSubComponentMeasurementScalesState.isPending}
        />
      </Modal>
      <Modal ref={addMeasurementScaleModalRef} title={`Add Measurement Scale`}>
        <ScalesForm
          onSubmit={onAddScalesSubmitHandler}
          createdSubComponentId={subComponent.id}
          loading={createSubComponentMeasurementScalesState.isPending}
        />
      </Modal>
      <Dialog
        ref={deleteDialogRef}
        title={`Delete sub component`}
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
