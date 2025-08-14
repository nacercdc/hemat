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

  const FooterOnOpen = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-white text-sm">
        <Icon icon="formkit:help" /> Help and support
      </div>
    </div>
  );

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
            <Image
              src="/images/icon.png"
              alt="logo"
              width={30}
              height={30}
              className="w-auto h-auto mt-[2.75rem]"
            />
          ),
        }}
        bgColor="white"
        isActivePath={isActivePath}
        groups={groups(ability, false)}
        separatorBetweenGroups={false}
        onNavigate={onNavigate}
        isLoading={false}
        footer={{
          expand: (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="formkit:help" /> Glossary
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
          collapse: null,
        }}
      />
    </div>
  );
}
