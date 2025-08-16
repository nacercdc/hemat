"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  Avatar,
  DropdownMenu,
  Input,
  Spinner,
  useSidebar,
} from "@etm/web-ui-components";
import { useRouter } from "next/navigation";
import { getInitials } from "~/utils/string.util";
import { useAddMutation as useLogout } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { useGetMe } from "~/providers/me/useGetMe";
import { TruncatedText } from "~/components/ui/TruncatedText";
export function NavBar() {
  const [searchValue, setSearchValue] = useState<string>("");
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: currentUser } = useGetMe();

  const { mutate: logoutFromServer, ...logoutFromServerState } =
    useLogout("/auth/logout");
  const { mutate: logoutFromLocal, ...logoutFromLocalState } =
    useLogout("/api/logout");

  const onNotificationClickHandler = () => {
    //  TODO: handle notification click
  };

  const onLogoutHandler = () => {
    logoutFromServer(undefined, {
      onSuccess: () =>
        logoutFromLocal(
          { baseURL: window.location.origin },
          {
            onSuccess: () => {
              window.location.reload();
            },
          }
        ),
    });
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  return (
    <nav className="flex items-center justify-between py-2 mb-1 w-full">
      <div className="flex-1 flex gap-3 items-center max-w-sm mr-7">
        {isMobile && (
          <Icon
            icon="proicons:panel-right-expand"
            className="w-10 h-10 rotate-180 cursor-pointer bg-white p-1 px-2 mb-2 hover:bg-primary-50 rounded-full"
            onClick={() => setOpenMobile(true)}
          />
        )}
        <Input
          size="lg"
          name="search"
          variant="search"
          type="search"
          placeholder={`Search anything here ...`}
          onChange={inputChangeHandler}
          value={searchValue}
          leftNode={<Icon icon="lucide:search" className="ml-3" />}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full bg-card hover:bg-basic-300 relative"
          onClick={onNotificationClickHandler}
        >
          <Icon icon="lucide:bell" className="h-5 w-5 flex" />
          <span className="absolute top-0 right-0 bg-destructive-500 text-basic-100 h-4 w-4 rounded-full text-xs">
            {3}
          </span>
        </button>

        <DropdownMenu
          align="end"
          trigger={
            <Avatar
              src={currentUser?.profile ? (currentUser?.profile.url ?? "") : ""}
              alt="user_profile_image"
              fallback={getInitials(
                currentUser?.profile ? currentUser?.profile.firstName : ""
              )}
            />
          }
          label={
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-3 justify-between w-full">
                <Avatar
                  src={
                    currentUser?.profile ? (currentUser?.profile.url ?? "") : ""
                  }
                  alt="user_profile_image"
                  fallback={getInitials(
                    currentUser?.profile ? currentUser?.profile.firstName : ""
                  )}
                />
                {currentUser?.roles.length && (
                  <div className="w-fit px-4 py-1 flex items-center justify-center rounded-sm bg-primary-200/35 border-r-2 rounded-r-none border-primary">
                    <span className="text-primary">
                      <TruncatedText
                        text={currentUser?.roles
                          .map((role) => role.name)
                          .join(",")}
                      />
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">{currentUser?.name}</span>
                <span className="text-dark-light text-xs">
                  {currentUser?.email}
                </span>
              </div>
            </div>
          }
          options={[
            {
              value: "profile_setting",
              label: "Profile Setting",
              leftNode: <Icon icon="tdesign:user-setting" />,
              separator: false,
              onClick: () => router.push("/profile"),
            },

            {
              separator: false,
              value: "logout",
              label:
                logoutFromServerState.isPending ||
                logoutFromLocalState.isPending
                  ? "Ending your session..."
                  : "Logout",
              leftNode:
                logoutFromServerState.isPending ||
                logoutFromLocalState.isPending ? (
                  <Spinner color="primary" size="sm" />
                ) : (
                  <Icon
                    icon="solar:logout-outline"
                    className="text-destructive"
                  />
                ),
              onClick:
                logoutFromServerState.isPending ||
                logoutFromLocalState.isPending
                  ? undefined
                  : onLogoutHandler,
            },
          ]}
        />
      </div>
    </nav>
  );
}
