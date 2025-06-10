"use client";

import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import type { DialogRef, ModalRef } from "@etm/web-ui-components";
import { Dialog, DropdownMenu, Modal } from "@etm/web-ui-components";
import type { User } from "~/libs/models/user.model";
import type { UserFormData } from "../form";
import { UserForm } from "../form";
import type { PermissionType } from "~/components/modules/administration/types";

interface Props {
  user: Partial<User>;
  refetch?: () => void;
}
export default function UserAction({ user }: Props) {
  const updateUserModalRef = useRef<ModalRef>(null);
  const deleteUserDialogRef = useRef<DialogRef>(null);

  const onUpdateUserFormSubmitHandler = (
    _permissions: Record<string, Record<PermissionType, boolean>>
  ) => {
    //TODO: implement update user
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
            label: "edit",
            leftNode: (
              <Icon
                icon="iconamoon:edit-light"
                className="!text-lg text-dark"
              />
            ),
            onClick: () => {
              updateUserModalRef.current?.openModal();
            },
          },
          {
            value: "delete",
            label: "Delete",
            leftNode: (
              <Icon
                icon="material-symbols-light:delete-outline"
                className="!text-xl text-dark"
              />
            ),
            onClick: () => {
              deleteUserDialogRef.current?.openDialog();
            },
          },
        ]}
      />
      <Modal ref={updateUserModalRef} title="Edit User">
        <UserForm
          onSubmitUserFormHandler={onUpdateUserFormSubmitHandler}
          rolePermissions={{ users: { create: true }, roles: { create: true } }}
          modules={[
            { name: "users", label: "Users" },
            { name: "roles", label: "Roles" },
          ]}
          onCloseModal={() => updateUserModalRef.current?.closeModal()}
          onRefetch={() => {
            //TODO: Implement on refectch func
          }}
          user={user as UserFormData}
          loading={false}
        />
      </Modal>
      <Dialog
        ref={deleteUserDialogRef}
        actionLabel="Yes"
        onAction={() => {
          //TODO: implement on delete user action
        }}
        title="Delete User"
      >
        Are you sure you want to delete this user?
      </Dialog>
    </>
  );
}
