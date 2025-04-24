/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import React from "react";
import { Sidebar as ETMSidebar } from "@etm/web-ui-components";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import useUserAbility from "~/providers/ability/casl/useUserAbility";
import { groups } from "./constants";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Sidebar() {
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
        headerOnOpen={
          <div className="flex justify-between items-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={120}
              height={140}
              className="w-auto h-auto"
            />
            <Icon
              icon="carbon:row-collapse"
              className="text-white w-6 transform -rotate-90"
            />
          </div>
        }
        headerOnCollapse={
          <div className="flex justify-between items-center">
            <Image
              src="/images/trackbars_icon.svg"
              alt="logo"
              width={20}
              height={20}
              className="w-auto h-auto"
            />
          </div>
        }
        bgColor="secondary"
        isActivePath={isActivePath}
        groups={groups(ability, false)}
        separatorBetweenGroups={false}
        onNavigate={onNavigate}
        isLoading={false}
      />
    </div>
  );
}
