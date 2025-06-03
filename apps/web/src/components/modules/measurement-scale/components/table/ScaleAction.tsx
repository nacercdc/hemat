import type { DialogRef, ModalRef } from "@etm/web-ui-components";
import { Dialog, DropdownMenu, Modal, useToast } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useRef } from "react";
import type { ScaleFormData } from "../form";
import { ScaleForm } from "../form";
import type { Scale } from "~/libs/models/scale.model";
interface Props {
  scale: Scale;
  onRefetch?: () => void;
}
export default function ScaleAction({ scale, onRefetch }: Props) {
   const editScaleModalRef = useRef<ModalRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);

  const { toast } = useToast();

  const onOpenModalHandler = () => {
   editScaleModalRef.current?.openModal()
  };

  const onCloseModalHandler = () => {
   editScaleModalRef.current?.closeModal();
  };

  const onDeleteScaleHandler = () => {
    //TODO: Add delete mutation logic here
    onRefetch?.();
    onCloseModalHandler();
    toast({
      title: "Success",
      message: "Scale has been deleted successfully.",
    });
  };

  const onSubmitScaleFormHandler = (_value: ScaleFormData) => {
    //TODO: Add edit mutation logic here
    onRefetch?.();
    onCloseModalHandler();
    toast({
      title: "Success",
      message: "Scale has been updated successfully.",
    });
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
        actionLoading={false}
      >
        Are you sure you want to delete this scale? This action cannot be
        undone.
      </Dialog>
      <Modal
       ref={editScaleModalRef}>
      <ScaleForm onSubmitScaleFormHandler={onSubmitScaleFormHandler } onCancelScaleFormHandler={onCloseModalHandler} scale={scale} />
      </Modal>
    </>
  );
}
