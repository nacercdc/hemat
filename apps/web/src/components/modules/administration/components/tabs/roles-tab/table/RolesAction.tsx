"use client";

import React, { useCallback, useRef } from "react";
import { Dialog, DropdownMenu, Modal, useToast } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useQueryClient } from "@tanstack/react-query";
import type { PermissionModule } from "../form";
import { RoleForm } from "../form";
import type { Permission } from "~/libs/models/permission.model";
import { getPermissionIds } from "~/components/modules/administration/utils";
import type { DialogRef, ModalRef } from "@etm/web-ui-components";
import type { PermissionType } from "~/components/modules/administration/types";
import type { Role, UpdateRole } from "~/libs/models/role.model";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";

interface Props {
  role: Role;
  onRefetch?: () => void;
  modules: PermissionModule[];
  permissions?: Permission[];
}

export default function RolesAction({
  role,
  onRefetch,
  modules,
  permissions,
}: Props) {
  const updateRoleModalRef = useRef<ModalRef>(null);
  const deleteRoleDialogRef = useRef<DialogRef>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: updateRole, ...updateRoleState } = usePutMutation<
    Role,
    UpdateRole
  >("roles");

  const { mutate: deleteRole, ...deleteRoleState } =
    useDeleteMutation<Role>("roles");

  const onDeleteRoleHandler = () => {
    deleteRole(
      {
        id: role.id,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Role has been deleted successfully!",
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["/roles"] });
          deleteRoleDialogRef.current?.closeDialog();
        },
      }
    );
  };

  const onUpdateRoleFormSubmitHandler = (
    roleName: string,
    roleDescription: string,
    modulePermissions: Record<string, Record<PermissionType, boolean>>
  ) => {
    let permissionsIds: string[] = [];

    if (permissions)
      permissionsIds = getPermissionIds(
        modules,
        permissions as unknown as Permission[],
        modulePermissions
      );

    updateRole(
      {
        data: {
          name: roleName,
          description: roleDescription,
          permissionsIds,
          id: role.id,
        },
        id: role.id,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Role has been updated successfully!",
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["/roles"] });
          updateRoleModalRef.current?.closeModal();
        },
      }
    );
  };

  const rolePermissions = useCallback(() => {
    let rolePerms: Record<
      string,
      Partial<Record<PermissionType, boolean>>
    > = {};
    role.permissions.forEach((perm) => {
      const { action, subject } = perm;
      rolePerms = {
        ...rolePerms,
        [subject]: {
          ...rolePerms[subject],
          [action]: true,
        },
      };
    });

    return rolePerms;
  }, [role.permissions]);

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
              updateRoleModalRef.current?.openModal();
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
              deleteRoleDialogRef.current?.openDialog();
            },
          },
        ]}
      />
      <Modal ref={updateRoleModalRef} title="Edit Role">
        <RoleForm
          onSubmitRoleFormHandler={onUpdateRoleFormSubmitHandler}
          rolePermissions={rolePermissions()}
          modules={modules}
          onCloseModal={() => updateRoleModalRef.current?.closeModal()}
          onRefetch={onRefetch}
          role={role}
          loading={updateRoleState.isPending}
        />
      </Modal>
      <Dialog
        ref={deleteRoleDialogRef}
        actionLabel="Yes"
        onAction={onDeleteRoleHandler}
        actionLoading={deleteRoleState.isPending}
        title="Delete Role"
        autoClosable={false}
      >
        Are you sure you want to delete this role?
      </Dialog>
    </>
  );
}
