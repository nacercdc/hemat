import type { DialogRef, ModalRef } from "@etm/web-ui-components";
import { Dialog, DropdownMenu, Modal, useToast } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useRef } from "react";
import type { LanguageFormData } from "../form";
import { LanguageForm } from "../form";
import type { Language } from "~/libs/models/language.model";
import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
interface Props {
  language: Language;
  onRefetch?: () => void;
}
export default function LanguageAction({ language, onRefetch }: Props) {
  const editLanguageModalRef = useRef<ModalRef>(null);
  const deleteDialogRef = useRef<DialogRef>(null);

  const { mutate: updateLanguage, ...updateLanguageState } = usePutMutation(
    `languages/${language.code}`
  );

  const { mutate: deleteLanguage, ...deleteLanguageState } =
    useDeleteMutation<Language>(`languages/${language.code}`);

  const { toast } = useToast();

  const onOpenModalHandler = () => {
    editLanguageModalRef.current?.openModal();
  };

  const onCloseModalHandler = () => {
    editLanguageModalRef.current?.closeModal();
  };

  const onDeleteLanguageHandler = () => {
    deleteLanguage(
      {},
      {
        onSuccess: () => {
          deleteDialogRef.current?.closeDialog();
          onRefetch?.();
          toast({
            title: "Success",
            message: "Language has been deleted successfully.",
          });
        },
      }
    );
  };

  const onSubmitLanguageFormHandler = (data: LanguageFormData) => {
    updateLanguage(
      {
        data: {
          name: data.name,
          code: data.code,
          native: data.native,
        },
        isProtected: true,
      },
      {
        onSuccess: () => {
          onRefetch?.();
          onCloseModalHandler();
          toast({
            title: "Success",
            message: "Language has been updated successfully.",
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
        title="Delete Language"
        actionLabel="Delete"
        actionVariant="destructive"
        onAction={onDeleteLanguageHandler}
        autoClosable={false}
        actionLoading={deleteLanguageState.isPending}
      >
        Are you sure you want to delete this language? This action cannot be
        undone.
      </Dialog>
      <Modal ref={editLanguageModalRef}>
        <LanguageForm
          language={language}
          isLoading={updateLanguageState.isPending}
          onSubmitLanguageForm={onSubmitLanguageFormHandler}
          onCancelLanguageForm={onCloseModalHandler}
        />
      </Modal>
    </>
  );
}
