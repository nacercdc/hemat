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

  const HeaderOnOpen = (
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
  );

  const HeaderOnCollapse = (
    <div className="flex justify-between items-center">
      <Image
        src="/images/icon.png"
        alt="logo"
        width={30}
        height={30}
        className="w-auto h-auto"
      />
    </div>
  );

  const FooterOnOpen = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-white text-sm">
        <Icon icon="formkit:help" /> Help and support
      </div>
      <span className="text-dark-light text-xs">
        &copy; Copyright. Vital Work Life {new Date().getFullYear()}
      </span>
    </div>
  );

  const onNavigate = (path: string | undefined) => {
    if (!path) return;

    router.push(path);
  };
  return (
    <div className="z-30">
      <ETMSidebar
        headerOnOpen={HeaderOnOpen}
        headerOnCollapse={HeaderOnCollapse}
        bgColor="secondary"
        isActivePath={isActivePath}
        groups={groups(ability, false)}
        separatorBetweenGroups={false}
        onNavigate={onNavigate}
        isLoading={false}
        footerOnOpen={FooterOnOpen}
      />
    </div>
  );
}
