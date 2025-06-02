"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Avatar, DropdownMenu, Input, Spinner } from "@etm/web-ui-components";
import { useRouter, useSearchParams } from "next/navigation";
import { getInitials } from "~/utils/string.util";
import { useAddMutation as useLogout } from "~/libs/tanstack-api-query/hooks/useAddMutation";
export function NavBar() {
  const [searchValue, setSearchValue] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const onProfileDetailClickHandler = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("type", "profile-detail");
    router.push(`/profile-settings?${params.toString()}`);
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  return (
    <nav className="flex items-center justify-between py-2 mb-1 w-full">
      <div className="flex-1 max-w-sm mr-7">
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
              src={"http://path-that-goes-no-where.com"}
              alt="user_profile_image"
              fallback={getInitials("ETM")}
            />
          }
          label={
            <Avatar
              src={"http://path-that-goes-no-where.com"}
              alt="user_profile_image"
              fallback={getInitials("ETM")}
            />
          }
          options={[
            {
              value: "profile_setting",
              label: "Profile Setting",
              leftNode: <Icon icon="tdesign:user-setting" />,
              onClick: () => {
                onProfileDetailClickHandler();
              },
            },
            {
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
                  <Icon icon="material-symbols:logout" />
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
