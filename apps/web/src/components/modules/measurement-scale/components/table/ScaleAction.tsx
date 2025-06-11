import type { DialogRef, ModalRef } from "@etm/web-ui-components";
import { Dialog, DropdownMenu, Modal, useToast } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useRef } from "react";
import { ScaleForm } from "../form";
import type { Scale, ScaleCreate } from "~/libs/models/scale.model";
import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
interface Props {
  scale: Scale;
  onRefetch?: () => void;
}
export default function ScaleAction({ scale, onRefetch }: Props) {
  const editScaleModalRef = useRef<ModalRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);

  const { mutate: updateScale, ...updateScaleState } = usePutMutation<
    Scale,
    ScaleCreate
  >(`measurement-scales/${scale.id}`);

  const { mutate: deleteScale, ...deleteScaleState } = useDeleteMutation<Scale>(
    `measurement-scales/${scale.id}`
  );

  const { toast } = useToast();

  const onOpenModalHandler = () => {
    editScaleModalRef.current?.openModal();
  };

  const onCloseModalHandler = () => {
    editScaleModalRef.current?.closeModal();
  };

  const onDeleteScaleHandler = () => {
    deleteScale(
      {},
      {
        onSuccess: () => {
          deleteDialogRef.current?.closeDialog();
          onRefetch?.();
          toast({
            title: "Success",
            message: "Scale has been deleted successfully.",
          });
        },
      }
    );
  };

  const onSubmitScaleFormHandler = (data: ScaleCreate) => {
    updateScale(
      {
        data,
        isProtected: true,
      },
      {
        onSuccess: () => {
          onRefetch?.();
          onCloseModalHandler();
          toast({
            title: "Success",
            message: "Scale has been updated successfully.",
            variant: "success",
          });
        },
      }
    );
  };

  return (
    <>
      <DropdownMenu
        triggerTextAlign="end"
        align="end"
        trigger={
          <Icon
            icon="mi:options-horizontal"
            className="text-xl text-right text-dark"
          />
        }
        options={[
          {
            value: "edit",
            label: "Edit",
            leftNode: (
              <Icon icon="iconamoon:edit-light" className="text-lg text-dark" />
            ),
            onClick: onOpenModalHandler,
          },
          {
            value: "delete",
            label: "Delete",
            leftNode: (
              <Icon
                icon="material-symbols-light:delete-outline"
                className="text-lg text-dark"
              />
            ),
            onClick: () => deleteDialogRef.current?.openDialog(),
          },
        ]}
      />
      <Dialog
        ref={deleteDialogRef}
        title="Delete Scale"
        actionLabel="Delete"
        actionVariant="destructive"
        onAction={onDeleteScaleHandler}
        autoClosable={false}
        actionLoading={deleteScaleState.isPending}
      >
        Are you sure you want to delete this scale? This action cannot be
        undone.
      </Dialog>
      <Modal ref={editScaleModalRef}>
        <ScaleForm
          scale={scale}
          isLoading={updateScaleState.isPending}
          onSubmitScaleFormHandler={onSubmitScaleFormHandler}
          onCancelScaleFormHandler={onCloseModalHandler}
        />
      </Modal>
    </>
  );
}
