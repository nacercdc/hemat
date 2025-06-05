"use client";

import React, { useRef } from "react";
import type { DialogRef, ModalRef } from "@etm/web-ui-components";
import { Dialog, DropdownMenu, Modal } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { Role } from "~/libs/models/role.model";
import { RoleForm } from "../form";
import type { PermissionType } from "~/components/modules/administration/types";

interface Props {
  role: Role;
  onRefetch?: () => void;
}

export default function RolesAction({ role: _, onRefetch }: Props) {
  const updateRoleModalRef = useRef<ModalRef>(null);
  const deleteRoleDialogRef = useRef<DialogRef>(null);

  const onUpdateRoleFormSubmitHandler = (
    _roleName: string,
    _roleDescription: string,
    _modulePermissions: Record<string, Record<PermissionType, boolean>>
  ) => {
    //TODO: implement update role
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
      <Modal ref={updateRoleModalRef} title="Edit User">
        <RoleForm
          onSubmitRoleFormHandler={onUpdateRoleFormSubmitHandler}
          rolePermissions={{ users: { create: true }, roles: { create: true } }}
          modules={[
            { name: "users", label: "Users" },
            { name: "roles", label: "Roles" },
          ]}
          onCloseModal={() => updateRoleModalRef.current?.closeModal()}
          onRefetch={onRefetch}
          role={{
            name: "super-administrator",
            description: "super-administrator role description",
          }}
          loading={false}
        />
      </Modal>
      <Dialog
        ref={deleteRoleDialogRef}
        actionLabel="Yes"
        onAction={() => {
          //TODO: implement on delete role action
        }}
        title="Delete Role"
      >
        Are you sure you want to delete this role?
      </Dialog>
    </>
  );
}
