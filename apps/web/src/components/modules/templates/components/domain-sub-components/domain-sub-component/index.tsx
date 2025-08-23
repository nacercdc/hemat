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
import { SUB_COMPONENT_LIST_QUERY_KEY } from "..";

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

  const baseOptions = [
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
        <Icon icon="iconamoon:edit-light" className="!text-dark !w-4 !h-4" />
      ),
      onClick: () => {
        editSubComponentModalRef.current?.openModal();
      },
    },

    {
      value: "add-measurement-scale",
      label: "Add Measurement Scale",
      leftNode: <Icon icon="tabler:plus" className="!text-dark !w-4 !h-4" />,
      onClick: () => {
        addMeasurementScaleModalRef.current?.openModal();
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
  ];

  const options =
    subComponent.measurementScales && subComponent.measurementScales.length > 0
      ? baseOptions.filter((option) => option.value !== "add-measurement-scale")
      : baseOptions;

  const onEditSubComponentSubmitHandler = (values: DefaultFieldsFormData) => {
    editSubComponent(
      {
        data: {
          id: subComponent.id,
          name: values.name,
          description: values.description,
          componentId: subComponent.componentId,
          translations: Object.fromEntries(
            Object.entries(values.translations).map(([key, value]) => [
              key,
              {
                name: value.name ?? "",
                description: value.description ?? "",
              },
            ])
          ),
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Sub Component updated successfully",
            variant: "success",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            message: "Something went wrong while updating sub component",
            variant: "destructive",
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
              message:
                "Sub component measurement scale description created successfully",
              variant: "success",
            });
            queryClient.invalidateQueries({
              queryKey: [SUB_COMPONENT_LIST_QUERY_KEY],
            });
            addMeasurementScaleModalRef.current?.closeModal();
          },
          onError: () => {
            toast({
              title: "Error",
              message:
                "Something went wrong while adding sub component measurement scale",
              variant: "destructive",
            });
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
              message:
                "Sub component measurement scale description updated successfully",
              variant: "success",
            });
            queryClient.invalidateQueries({
              queryKey: [SUB_COMPONENT_LIST_QUERY_KEY],
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
            queryKey: [SUB_COMPONENT_LIST_QUERY_KEY],
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
        options={options}
      />
      <div className="flex items-center justify-between w-full gap-5 ">
        <h5 className="text-sm font-medium">{subComponent?.name}</h5>
      </div>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        {drawerOpen && <ComponentDetail subComponent={subComponent} />}
      </Drawer>
      <Modal ref={editSubComponentModalRef} title={`Edit sub component`}>
        <SubComponentForm
          subComponent={subComponent}
          onScalesSubmit={onEditScalesSubmitHandler}
          defaultFieldsState={editSubComponentState.status}
          onDefaultFieldsSubmit={onEditSubComponentSubmitHandler}
          scalesState={editSubComponentMeasurementScalesState.status}
        />
      </Modal>
      <Modal
        ref={addMeasurementScaleModalRef}
        title={`Add measurement scale description`}
      >
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
        <span className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this sub component? This action
            cannot be undone.
          </p>
        </span>
      </Dialog>
    </div>
  );
}
