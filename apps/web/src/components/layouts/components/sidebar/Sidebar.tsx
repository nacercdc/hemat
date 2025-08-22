/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";
import React from "react";
import { Sidebar as ETMSidebar, Tooltip } from "@etm/web-ui-components";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import useUserAbility from "~/providers/ability/casl/useUserAbility";
import { groups } from "./constants";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGetMe } from "~/providers/me/useGetMe";

export default function Sidebar() {
  const { data: currentUser, ...currentUserState } = useGetMe();
  const router = useRouter();
  const pathName = usePathname();
  const ability = useUserAbility();

  const isActivePath = (itemPath?: string) => {
    if (!itemPath) return false;
    const itemPathArr = itemPath.split("/");
    return itemPath === "/"
      ? pathName === itemPath
      : pathName.includes(
          itemPathArr[itemPathArr.length - 1]?.toLocaleLowerCase()!
        );
  };

  const onNavigate = (path: string | undefined) => {
    if (!path) return;

    router.push(path);
  };

  return (
    <div className="z-30">
      <ETMSidebar
        header={{
          expand: (
            <div className="flex justify-between items-center -mb-1 pt-10 w-full">
              <Image
                src="/images/acdc-logo.svg"
                alt="logo"
                width={160}
                height={84}
                className="w-[160px] h-auto"
              />
              <Icon
                icon="carbon:row-collapse"
                className="text-white w-6 transform -rotate-90"
              />
            </div>
          ),
          collapse: (
            <div
              className="relative mt-[2.75rem] -ml-1.5"
              style={{
                width: 35,
                height: 35,
              }}
            >
              <Image
                src="/images/icon.svg"
                alt="logo"
                fill
                className="object-contain"
              />
            </div>
          ),
        }}
        bgColor="white"
        isActivePath={isActivePath}
        groups={groups(ability)}
        separatorBetweenGroups={false}
        onNavigate={onNavigate}
        isLoading={
          !currentUser ||
          currentUserState.isFetching ||
          currentUserState.isLoading
        }
        footer={{
          expand: (
            <div className="flex flex-col gap-2">
              <div
                className="text-xs flex gap-1 items-center text-dark px-2 cursor-pointer"
                onClick={() => onNavigate("/glossary")}
              >
                <Icon icon="mdi:help-circle-outline" className="text-lg" />
                Glossary
              </div>
              <Image
                src="/images/branding-texture.png"
                alt="logo"
                width={117}
                height={62}
                className="transform scale-x-[-1]"
              />
            </div>
          ),
          collapse: (
            <Icon
              icon="mdi:help-circle-outline"
              className="text-lg cursor-pointer mx-auto mb-16"
              onClick={() => onNavigate("/glossary")}
            />
          ),
        }}
      />
    </div>
  );
}
