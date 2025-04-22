"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Avatar, DropdownMenu, Input } from "@etm/web-ui-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddMutation as useLogoutFromServer } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { signOut } from "next-auth/react";
import { useFetchMe } from "~/providers/fetch-me/useFetchMe";
import ProfileSkeleton from "~/components/modules/components/profile-avatar/skeletons/ProfileSkeleton";
import AvatarSkeleton from "~/components/modules/components/profile-avatar/skeletons/AvatarSkeleton";
import ProfileAvatar from "~/components/modules/components/profile-avatar/ProfileAvatar";
import { getInitials } from "~/utils/string.util";

export function NavBar() {
  const [searchValue, setSearchValue] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: currentUser, ...currentUserState } = useFetchMe();

  const { mutate: logoutFormServer, ...logoutFormServerState } =
    useLogoutFromServer("/logout");

  const userAvatarLabelComponent = () => {
    return (
      <>
        {currentUserState.isLoading && (
          <div className="min-w-52">
            <ProfileSkeleton />
          </div>
        )}
        {currentUserState.isSuccess && currentUser?.data && (
          <ProfileAvatar
            name={currentUser.data.name}
            id={currentUser.data.id}
            contact={currentUser.data.email}
          />
        )}
      </>
    );
  };

  const onNotificationClickHandler = () => {
    //  TODO: handle notification click
  };

  const onLogoutHandler = () => {
    logoutFormServer(
      {},
      {
        onSuccess: async () => {
          await signOut({ redirect: true, callbackUrl: "/login" });
        },
      }
    );
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
          className="p-2 rounded-full bg-white hover:bg-basic-300 relative"
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
            currentUserState.isLoading ? (
              <AvatarSkeleton />
            ) : (
              <Avatar
                src={"http://path-that-goes-no-where.com"}
                alt="user_profile_image"
                fallback={getInitials(currentUser?.data.name)}
              />
            )
          }
          label={userAvatarLabelComponent()}
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
              label: logoutFormServerState.isPending ? "Loading..." : "Logout",
              leftNode: <Icon icon="material-symbols:logout" />,
              onClick: onLogoutHandler,
            },
          ]}
        />
      </div>
    </nav>
  );
}
