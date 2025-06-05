/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { PageContainer } from "../components/PageContainer";
import type { ModalRef } from "@etm/web-ui-components";
import { Button, Modal, useToast } from "@etm/web-ui-components";
import { UpsideDownInvertedTabs } from "~/components/ui/upside-down-inverted-tabs";
import { RolesTable } from "./components/tabs/roles-tab";
import type { PermissionModule } from "./components/tabs/roles-tab/form";
import { RoleForm } from "./components/tabs/roles-tab/form";
import { UsersTable } from "./components/tabs/users-tab/table";
// import { UserForm } from "./components/tabs/users-tab/form";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Permission } from "~/libs/models/permission.model";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import type { CreateRole, Role } from "~/libs/models/role.model";
import { getPermissionIds } from "./utils";
import type { PermissionType } from "./types";
import { useQueryClient } from "@tanstack/react-query";

type TabsType = "USERS" | "ROLES";

export function Administration() {
  const [activeTab, setActiveTab] = useState<TabsType>("USERS");
  const addRoleModalRef = useRef<ModalRef>(null);
  const addUserModalRef = useRef<ModalRef>(null);
  const [modules, setModules] = useState<PermissionModule[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createRole, ...createRoleState } = useAddMutation<
    Role,
    CreateRole
  >("roles");

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

  const _onAddNewUserFormSubmitHandler = (
    permissions: Record<string, Record<PermissionType, boolean>>
  ) => {
    console.log(permissions);
  };

  const onUserRoleModalOpenHandler = () => {
    if (activeTab === "USERS") {
      addUserModalRef.current?.openModal();
    }
    if (activeTab === "ROLES") {
      addRoleModalRef.current?.openModal();
    }
  };

  const onTabClickHandler = (tab: TabsType) => setActiveTab(tab);

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
                  <UsersTable />
                </div>
              ),
            },
            {
              value: "ROLES",
              label: "Roles",
              content: (
                <div className="mt-7">
                  <RolesTable />
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
          onRefetch={() => {
            //TODO: replace with refetch func
          }}
          modules={modules}
          loading={createRoleState.isPending}
        />
      </Modal>
      {/* <Modal ref={addUserModalRef} title="Add User">
        <UserForm
          onSubmitUserFormHandler={onAddNewUserFormSubmitHandler}
          onCloseModal={addUserModalRef.current?.closeModal}
          onRefetch={() => {
            //TODO: replace with refetch func
          }}
          modules={modules}
          loading={false}
        />
      </Modal> */}
    </PageContainer>
  );
}
