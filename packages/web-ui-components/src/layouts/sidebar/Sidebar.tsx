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
} from "../../shadcn-ui";
import { Icon } from "@iconify/react";
import { cn } from "../../shadcn-ui/utils/cn";

interface MenuItem {
  id: string;
  label: string;
  inactiveIcon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permission?: string;
}

interface Group {
  label?: string;
  isCollapsible?: boolean;
  menuItems: MenuItem[];
}

interface Props {
  groups: Group[];
  userPermissions: string[];
  headerOnOpen: React.ReactNode;
  headerOnCollapse: React.ReactNode;
  footerOnOpen?: React.ReactNode;
  footerOnCollapse?: React.ReactNode;
  backgroundImagePath?: string;
  isLoading?: boolean;
  loadingIndicator?: React.ReactNode;
  isActivePath: (itemPath: string) => boolean;
  onNavigate: (path: string | undefined) => void;
}

export function Sidebar({
  groups,
  userPermissions,
  headerOnOpen,
  headerOnCollapse,
  footerOnOpen,
  footerOnCollapse,
  isActivePath,
  backgroundImagePath,
  isLoading,
  loadingIndicator,
  onNavigate,
}: Props) {
  const [openCollapsibles, setOpenCollapsibles] = useState<
    Record<string, boolean>
  >({});
  const { toggleSidebar, open } = useSidebar();

  const toggleCollapsible = (id: string) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isItemActive = (itemId: string, itemPath?: string) => {
    return itemPath ? isActivePath(itemPath) : false;
  };

  const hasPermission = (item: MenuItem) => {
    if (!item.permission || userPermissions.includes(item.permission))
      return true;
    return false;
  };

  const renderGroups = (
    { menuItems, label, isCollapsible }: Group,
    index: number
  ) => {
    return (
      <div key={index}>
        <SidebarSeparator />
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
                <SidebarMenu className="gap-3 mt-3">
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
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.label}
                onClick={() => toggleCollapsible(item.id)}
              >
                {item.inactiveIcon && <span>{item.inactiveIcon}</span>}
                <span>{item.label}</span>
                {openCollapsibles[item.id] ? (
                  <Icon
                    icon={"lucide:chevron-down"}
                    className="ml-auto w-4 h-4"
                  />
                ) : (
                  <Icon
                    icon={"lucide:chevron-right"}
                    className="ml-auto w-4 h-4"
                  />
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children?.map((subItem) => renderMenuItem(subItem))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          asChild
          tooltip={item.label}
          isActive={isItemActive(item.id, item.path)}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.path);
          }}
          className={cn("font-semibold", open && "px-6")}
        >
          <span className={cn("cursor-pointer")}>
            {(item.activeIcon || item.inactiveIcon) && (
              <span
                className={cn(
                  isItemActive(item.id, item.path) && "text-info-800 font-bold"
                )}
              >
                {item.activeIcon &&
                  isItemActive(item.id, item.path) &&
                  item.activeIcon}
                {item.inactiveIcon &&
                  !isItemActive(item.id, item.path) &&
                  item.inactiveIcon}
              </span>
            )}
            <span
              className={cn(
                isItemActive(item.id, item.path) && "text-info-800 font-bold"
              )}
            >
              {item.label}
            </span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  if (isLoading) {
    if (loadingIndicator) return loadingIndicator;
    return null;
  }

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarContent
        className={cn(backgroundImagePath && "bg-cover bg-no-repeat")}
        style={{ backgroundImage: `url(${backgroundImagePath})` }}
      >
        <SidebarMenu className="flex flex-col h-full overflow-hidden">
          <SidebarMenuItem
            className={cn(
              "mb-6 mt-9",
              open && "px-7",
              !open && "pl-3.5",
              "cursor-pointer"
            )}
            onClick={toggleSidebar}
          >
            {open && headerOnOpen}
            {!open && headerOnCollapse}
          </SidebarMenuItem>
          <div className="flex-1 overflow-auto">
            {groups.map((group, index) => renderGroups(group, index))}
          </div>
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
