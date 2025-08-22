/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { PageContainer } from "../components/PageContainer";
import { Button, Modal, useToast } from "@etm/web-ui-components";
import { UpsideDownInvertedTabs } from "~/components/ui/upside-down-inverted-tabs";
import { RolesTable } from "./components/tabs/roles-tab";
import { RoleForm } from "./components/tabs/roles-tab/form";
import { UsersTable } from "./components/tabs/users-tab/table";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { getPermissionIds } from "./utils";
import { useQueryClient } from "@tanstack/react-query";
import type { UserFormData } from "./components/tabs/users-tab/form";
import { UserForm } from "./components/tabs/users-tab/form";
import type { PermissionModule } from "./components/tabs/roles-tab/form";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { ModalRef } from "@etm/web-ui-components";
import type { Permission } from "~/libs/models/permission.model";
import type { CreateRole, Role } from "~/libs/models/role.model";
import type { PermissionType } from "./types";
import type { CreateUser, User } from "~/libs/models/user.model";

type TabsType = "USERS" | "ROLES";

export function Administration() {
  const [activeTab, setActiveTab] = useState<TabsType>("USERS");
  const [modules, setModules] = useState<PermissionModule[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addRoleModalRef = useRef<ModalRef>(null);
  const addUserModalRef = useRef<ModalRef>(null);

  const { mutate: createRole, ...createRoleState } = useAddMutation<
    Role,
    CreateRole
  >("roles");

  const { mutate: createUser, ...createUserState } = useAddMutation<
    User,
    CreateUser
  >("users");

  const { data: permissions, ...permissionsState } = useFindAll<
    QueryManyResponse<Permission>
  >({
    path: "/permissions",
  });

  const onAddNewRoleFormSubmitHandler = (
    roleName: string,
    roleDescription: string,
    modulePermissions: Record<string, Record<PermissionType, boolean>>
  ) => {
    let permissionsIds: string[] = [];

    if (permissions)
      permissionsIds = getPermissionIds(
        modules,
        permissions.data as unknown as Permission[],
        modulePermissions
      );

    createRole(
      {
        data: { name: roleName, description: roleDescription, permissionsIds },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Role has been created successfully!",
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["/roles"] });
          addRoleModalRef.current?.closeModal();
        },
      }
    );
  };

  const onAddNewUserFormSubmitHandler = (
    modulePermissions: Record<string, Record<PermissionType, boolean>>,
    values: UserFormData
  ) => {
    let permissionsIds: string[] | undefined = [];

    if (permissions)
      permissionsIds = getPermissionIds(
        modules,
        permissions.data as unknown as Permission[],
        modulePermissions
      );

    const roleIds = values.roles.map((role) => role.id);

    if (!permissionsIds.length) permissionsIds = undefined;

    createUser(
      {
        data: {
          ...values,
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          title: values.title.id,
          roleIds,
          permissionsIds,
          confirmPassword: values.password,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "User has been created successfully!",
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["/users"] });
          addUserModalRef.current?.closeModal();
        },
      }
    );
  };

  const onUserRoleModalOpenHandler = () => {
    if (activeTab === "USERS") {
      addUserModalRef.current?.openModal();
    }
    if (activeTab === "ROLES") {
      addRoleModalRef.current?.openModal();
    }
  };

  const onRefetchHandler = async (key: string) => {
    queryClient.removeQueries({
      queryKey: [`${key}`],
    });

    await queryClient.invalidateQueries({
      queryKey: [`${key}`],
      refetchType: "active",
    });
  };

  const onTabClickHandler = (tab: TabsType) => {
    if (tab === "USERS") {
      onRefetchHandler("/users");
    }
    if (tab === "ROLES") {
      onRefetchHandler("/roles");
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    if (permissions?.data && permissionsState.isSuccess) {
      setModules(
        [
          ...new Set(
            permissions.data.map(
              (per) => (per as unknown as Permission).subject
            )
          ),
        ].map((module) => ({
          name: module,
          label: module[0]!.toUpperCase() + module?.slice(1),
        }))
      );
    }
  }, [permissions, permissionsState.isSuccess]);

  return (
    <PageContainer
      pageTitle="Administration"
      includeBreadcrumb={false}
      actionNodes={
        <Button
          leftNode={
            <Icon icon={"material-symbols:add"} className="!w-5 !h-5" />
          }
          size="lg"
          onClick={onUserRoleModalOpenHandler}
        >
          Add
        </Button>
      }
    >
      <div className="px-8">
        <UpsideDownInvertedTabs
          options={[
            {
              value: "USERS",
              label: "Users",
              content: (
                <div className="mt-7">
                  <UsersTable
                    modules={modules}
                    permissions={permissions?.data as unknown as Permission[]}
                  />
                </div>
              ),
            },
            {
              value: "ROLES",
              label: "Roles",
              content: (
                <div className="mt-7">
                  <RolesTable
                    modules={modules}
                    permissions={permissions?.data as unknown as Permission[]}
                  />
                </div>
              ),
            },
          ]}
          defaultValue={activeTab}
          onTabClick={(tabValue) => onTabClickHandler(tabValue as TabsType)}
        />
      </div>
      <Modal ref={addRoleModalRef} title="Add Role">
        <RoleForm
          onSubmitRoleFormHandler={onAddNewRoleFormSubmitHandler}
          onCloseModal={addRoleModalRef.current?.closeModal}
          modules={modules}
          loading={createRoleState.isPending}
        />
      </Modal>
      <Modal ref={addUserModalRef} title="Add User">
        <UserForm
          onSubmitUserFormHandler={onAddNewUserFormSubmitHandler}
          onCloseModal={addUserModalRef.current?.closeModal}
          modules={modules}
          loading={createUserState.isPending}
        />
      </Modal>
    </PageContainer>
  );
}
