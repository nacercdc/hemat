"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { PageContainer } from "../components/PageContainer";
import type { ModalRef } from "@etm/web-ui-components";
import { Button, Modal } from "@etm/web-ui-components";
import { UpsideDownInvertedTabs } from "~/components/ui/upside-down-inverted-tabs";
import { RolesTable } from "./components/tabs/roles-tab";
import { RoleForm } from "./components/tabs/roles-tab/form";
import { UsersTable } from "./components/tabs/users-tab/table";
import { UserForm } from "./components/tabs/users-tab/form";
import type { PermissionType } from "./types";

type TabsType = "USERS" | "ROLES";

export function Administration() {
  const [activeTab, setActiveTab] = useState<TabsType>("USERS");
  const addRoleModalRef = useRef<ModalRef>(null);
  const addUserModalRef = useRef<ModalRef>(null);

  const onAddNewRoleFormSubmitHandler = (
    _roleName: string,
    _modulePermissions: Record<string, Record<PermissionType, boolean>>
  ) => {
    //TODO: implement add role functionality
  };

  const onAddNewUserFormSubmitHandler = (
    _permissions: Record<string, Record<PermissionType, boolean>>
  ) => {
    //TODO: implement add user functionality
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
          modules={[
            { name: "users", label: "Users" },
            { name: "roles", label: "Roles" },
          ]}
          loading={false}
        />
      </Modal>
      <Modal ref={addUserModalRef} title="Add User">
        <UserForm
          onSubmitUserFormHandler={onAddNewUserFormSubmitHandler}
          onCloseModal={addUserModalRef.current?.closeModal}
          onRefetch={() => {
            //TODO: replace with refetch func
          }}
          modules={[
            { name: "users", label: "Users" },
            { name: "roles", label: "Roles" },
          ]}
          loading={false}
        />
      </Modal>
    </PageContainer>
  );
}
