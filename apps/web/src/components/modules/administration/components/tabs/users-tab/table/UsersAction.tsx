"use client";

import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import { Dialog, DropdownMenu, Modal, useToast } from "@etm/web-ui-components";
import { UserForm } from "../form";
import {
  getPermissionIds,
  rolePermissions,
} from "~/components/modules/administration/utils";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import { useQueryClient } from "@tanstack/react-query";
import type { DialogRef, ModalRef } from "@etm/web-ui-components";
import type { UpdateUser, User } from "~/libs/models/user.model";
import type { PermissionModule, UserFormData } from "../form";
import type { PermissionType } from "~/components/modules/administration/types";
import type { Permission } from "~/libs/models/permission.model";
import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";

interface Props {
  user: User;
  refetch?: () => void;
  modules: PermissionModule[];
  permissions?: Permission[];
}
export default function UserAction({ user, modules, permissions }: Props) {
  const updateUserModalRef = useRef<ModalRef>(null);
  const deleteUserDialogRef = useRef<DialogRef>(null);

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate: updateUser, ...updateUserState } = usePutMutation<
    User,
    UpdateUser
  >("users");

  const { mutate: deleteUser, ...deleteUserState } = useDeleteMutation(
    `users/${user.id}`
  );

  const onDeleteUserHandler = () => {
    deleteUser(
      {},
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "User has been deleted successfully!",
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["/users"] });
          deleteUserDialogRef.current?.closeDialog();
        },
      }
    );
  };

  const onUpdateUserFormSubmitHandler = (
    modulePermissions: Record<string, Record<PermissionType, boolean>>,
    values: UserFormData
  ) => {
    let permissionsIds: string[] | undefined = [];

    if (permissions)
      permissionsIds = getPermissionIds(
        modules,
        permissions as unknown as Permission[],
        modulePermissions
      );

    const roleIds = values.roles.map((role) => role.id);

    if (!permissionsIds.length) permissionsIds = undefined;

    updateUser(
      {
        data: {
          ...values,
          roleIds,
          permissionsIds,
          id: user.id,
          title: values.title.id,
        },
        id: user.id,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "User has been updated successfully!",
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["/users"] });
          updateUserModalRef.current?.closeModal();
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
          rolePermissions={rolePermissions(user.permissions ?? [])}
          modules={modules}
          onCloseModal={() => updateUserModalRef.current?.closeModal()}
          user={
            {
              ...user,
              firstName: user.name.split(" ")[0],
              lastName: user.name.split(" ")[1],
            } as unknown as User
          }
          loading={updateUserState.isPending}
        />
      </Modal>
      <Dialog
        ref={deleteUserDialogRef}
        actionLabel="Yes"
        onAction={onDeleteUserHandler}
        autoClosable={false}
        actionLoading={deleteUserState.isPending}
        title="Delete User"
      >
        Are you sure you want to delete this user?
      </Dialog>
    </>
  );
}
