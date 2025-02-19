"use client";

import React from "react";
import type { DropdownMenuOption } from "@etm/web-ui-components";
import { DropdownMenu, Input } from "@etm/web-ui-components";
import { Icon } from "@iconify/react";

interface Props {
  pageTitle: string;
  pageDescription: React.ReactNode;
  accountAvatar: React.ReactNode;
  accountDropdownOptions: DropdownMenuOption[];
  searchValue: string;
  notificationsCount: number;
  onNotificationClick: () => void;
  onInputSearch: (v: string) => void;
}

export function NavBar({
  pageTitle,
  pageDescription,
  accountAvatar,
  accountDropdownOptions,
  searchValue,
  notificationsCount,
  onNotificationClick,
  onInputSearch,
}: Props) {
  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputSearch(event.target.value);
  };
  return (
    <nav className="flex items-center justify-between p-4 mb-2 w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-bold">{pageTitle}</h1>
        <h3 className="text-sm font-light">{pageDescription}</h3>
      </div>

      <div className="flex-1 mx-4 max-w-md">
        <Input
          name="search"
          type="search"
          placeholder={`Search ${pageTitle.toLocaleLowerCase()}`}
          onChange={inputChangeHandler}
          value={searchValue}
          leftNode={<Icon icon="lucide:search" />}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full bg-white hover:bg-basic-300 relative"
          onClick={onNotificationClick}
        >
          <Icon icon="lucide:bell" className="h-5 w-5 flex" />
          {/* TODO: replace this with our own badge component */}
          <span className="absolute top-0 right-0 bg-destructive-500 text-basic-100 h-4 w-4 rounded-full text-xs">
            {notificationsCount}
          </span>
        </button>

        <DropdownMenu
          trigger={accountAvatar}
          options={accountDropdownOptions}
        />
      </div>
    </nav>
  );
}
