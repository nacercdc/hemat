"use client";

import React, { useState } from "react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  SidebarMenuSub,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarRail,
  useSidebar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Skeleton,
} from "../../shadcn-ui";
import { Icon } from "@iconify/react";
import { cn } from "../../shadcn-ui/utils/cn";

type BGColor = "primary" | "secondary" | "white";

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permission?: boolean;
  depth: number;
}

export interface Group {
  label?: string;
  isCollapsible?: boolean;
  menuItems: MenuItem[];
}

interface Props {
  groups: Group[];
  headerOnOpen: React.ReactNode;
  headerOnCollapse: React.ReactNode;
  footerOnOpen?: React.ReactNode;
  footerOnCollapse?: React.ReactNode;
  backgroundImagePath?: string;
  bgColor?: BGColor;
  separatorBetweenGroups: boolean;
  isLoading?: boolean;
  isActivePath: (itemPath?: string) => boolean;
  onNavigate: (path: string | undefined) => void;
}

export function Sidebar({
  groups,
  headerOnOpen,
  headerOnCollapse,
  footerOnOpen,
  footerOnCollapse,
  backgroundImagePath,
  bgColor = "white",
  separatorBetweenGroups = true,
  isLoading,
  isActivePath,
  onNavigate,
}: Props) {
  const [openCollapsible, setOpenCollapsible] = useState<
    Record<string, boolean>
  >({});
  const { toggleSidebar, open } = useSidebar();

  const toggleCollapsible = (id: string) => {
    setOpenCollapsible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isItemActive = (itemPath?: string) => {
    return isActivePath(itemPath);
  };

  const isParentActive = (items?: MenuItem[]) => {
    if (!items) return;
    return items
      .map((item) => {
        return isActivePath(item.path);
      })
      .includes(true)
      ? true
      : false;
  };

  const hasPermission = (item: MenuItem) => {
    return item.permission;
  };

  const CollapsedSidebarMenuItem = (item: MenuItem) => {
    return (
      <SidebarMenuButton
        tooltip={item.label}
        onClick={() => toggleCollapsible(item.id)}
        className={cn(
          "font-medium text-secondary-foreground hover:bg-tbsidebar-accent hover:text-secondary-foreground py-[20px] text-sm data-[state=open]:hover:bg-tbsidebar-accent data-[state=open]:hover:text-secondary-foreground active:bg-secondary-500 active:text-secondary-foreground",
          isParentActive(item.children) && "bg-tbsidebar-accent"
        )}
      >
        {item.icon && (
          <span className={cn("text-xl", !open && "text-lg")}>{item.icon}</span>
        )}
        <span>{item.label}</span>
        {openCollapsible[item.id] ? (
          <Icon icon={"lucide:chevron-down"} className="ml-auto w-4 h-4" />
        ) : (
          <Icon icon={"lucide:chevron-right"} className="ml-auto w-4 h-4" />
        )}
      </SidebarMenuButton>
    );
  };

  const renderGroups = (
    { menuItems, label, isCollapsible }: Group,
    index: number
  ) => {
    return (
      <div key={index}>
        {separatorBetweenGroups && <SidebarSeparator />}
        <Collapsible defaultOpen className={`group/gcollapsible`}>
          <SidebarGroup>
            {label && isCollapsible && (
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  {label}
                  <Icon
                    icon="lucide:chevron-down"
                    className={`ml-auto transition-transform group-data-[state=open]/gcollapsible:rotate-180`}
                  />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
            )}
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1 mt-3">
                  {menuItems.map((item) => renderMenuItem(item))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </div>
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    if (!hasPermission(item)) return null;

    if (item.children) {
      return (
        <Collapsible key={item.id} className={`group/mcollapsible${item.id}`}>
          {open && (
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                {CollapsedSidebarMenuItem(item)}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="relative border-l-0 ml-6 before:absolute before:left-0 before:top-[15%] before:h-[70%] before:w-[1px] before:bg-primary">
                  {item.children?.map((subItem) => renderMenuItem(subItem))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          )}

          {!open && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {CollapsedSidebarMenuItem(item)}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-fit bg-secondary-50 border-none"
              >
                {item.children?.map((subItem) => {
                  return (
                    <DropdownMenuItem
                      key={subItem.id}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(subItem.path);
                      }}
                    >
                      <span
                        className={cn(
                          "w-2.5 h-2.5 rounded-full bg-secondary-400 invisible",
                          isItemActive(subItem.path) && "visible"
                        )}
                      ></span>
                      <span className="text-secondary-400">
                        {subItem.label}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          asChild
          tooltip={item.label}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.path);
          }}
          className={cn(
            "font-medium text-secondary-foreground hover:bg-tbsidebar-accent hover:text-secondary-foreground active:bg-secondary-500 active:text-secondary-foreground py-[20px] text-sm",
            isItemActive(item.path)
              ? item.depth === 0
                ? "bg-tbsidebar-accent"
                : "text-secondary-400"
              : "",
            item.depth !== 0 &&
              "hover:bg-transparent hover:text-secondary-400 active:bg-transparent",
            !open && "p-0 m-0"
          )}
        >
          <span
            className={cn(
              "cursor-pointer",
              isItemActive(item.path) && "font-semibold"
            )}
          >
            {item.icon && item.depth === 0 && (
              <span className={cn("text-xl", !open && "text-lg")}>
                {item.icon}
              </span>
            )}
            {item.icon && item.depth !== 0 && (
              <span
                className={cn(
                  "text-lg",
                  !open && "hidden",
                  isItemActive(item.path) && "text-primary"
                )}
              >
                {item.icon}
              </span>
            )}
            <span
              className={cn(
                isItemActive(item.path) && item.depth !== 0 && "text-primary"
              )}
            >
              {item.label}
            </span>
            {item.icon && item.depth !== 0 && (
              <div className="flex w-full justify-end">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full bg-primary invisible justify-self-end",
                    isItemActive(item.path) && "visible"
                  )}
                ></span>
              </div>
            )}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const SidebarSkeleton = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <Skeleton
        key={index}
        className={cn(
          "h-[30px] rounded-lg bg-sidebar-accent opacity-10",
          index % 2 === 0 ? "w-[180px]" : "w-[200px]",
          !open && "w-8"
        )}
      />
    ));
  };

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarContent
        className={cn(
          backgroundImagePath ? "bg-cover bg-no-repeat" : `bg-${bgColor}`
        )}
        style={
          backgroundImagePath
            ? { backgroundImage: `url(${backgroundImagePath})` }
            : undefined
        }
      >
        <SidebarMenu className="flex flex-col h-full overflow-hidden">
          <SidebarMenuItem
            className={cn(
              "mb-6 mt-4",
              open && "px-4",
              !open && "px-3.5",
              "cursor-pointer"
            )}
            onClick={toggleSidebar}
          >
            {open && headerOnOpen}
            {!open && headerOnCollapse}
          </SidebarMenuItem>
          {!isLoading && (
            <div className="flex-1 overflow-auto">
              {groups.map((group, index) => renderGroups(group, index))}
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col gap-2 px-2 mt-6">
              {SidebarSkeleton()}
            </div>
          )}
          {open && (
            <SidebarMenuItem className="self-center my-3">
              <div>{footerOnOpen}</div>
            </SidebarMenuItem>
          )}
          {!open && <div>{footerOnCollapse}</div>}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </ShadcnSidebar>
  );
}
