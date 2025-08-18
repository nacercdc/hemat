"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  useSidebar as useShadcnSidebar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Skeleton,
} from "../../shadcn-ui";
import { Icon } from "@iconify/react";
import { cn } from "../../shadcn-ui/utils/cn";

export const useSidebar = useShadcnSidebar;

type BGColor = "primary" | "white";

interface HeaderFooterContent {
  collapse: React.ReactNode;
  expand: React.ReactNode;
}
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
  header: HeaderFooterContent;
  footer: HeaderFooterContent;
  backgroundImagePath?: string;
  bgColor?: BGColor;
  separatorBetweenGroups: boolean;
  isLoading?: boolean;
  isActivePath: (itemPath?: string) => boolean;
  onNavigate: (path: string | undefined) => void;
}

export function Sidebar({
  groups,
  header,
  footer,
  backgroundImagePath,
  bgColor = "white",
  separatorBetweenGroups = true,
  isLoading,
  isActivePath,
  onNavigate,
}: Props) {
  const [activeCollapsible, setActiveCollapsible] = useState<string | null>(
    null
  );
  const { toggleSidebar, open } = useSidebar();

  useEffect(() => {
    let foundActive = false;
    for (const group of groups) {
      for (const item of group.menuItems) {
        if (item.children?.some((child) => isActivePath(child.path))) {
          setActiveCollapsible(item.id);
          foundActive = true;
          break;
        }
      }
      if (foundActive) break;
    }
  }, [groups, isActivePath]);

  const toggleCollapsible = (id: string) => {
    setActiveCollapsible((prevId) => (prevId === id ? null : id));
  };

  const isItemActive = (itemPath?: string) => {
    return isActivePath(itemPath);
  };

  const isParentActive = (items?: MenuItem[]) => {
    if (!items) return false;
    return items.some((item) => isActivePath(item.path));
  };

  const hasPermission = (item: MenuItem) => {
    return item.permission;
  };

  const CollapsedSidebarMenuItem = (item: MenuItem) => {
    const isActive = isParentActive(item.children);

    return (
      <SidebarMenuButton
        tooltip={item.label}
        onClick={() => toggleCollapsible(item.id)}
        className={cn(
          "hover:!bg-primary/5",
          "font-medium text-foreground hover:bg-tbsidebar-accent hover:text-primary py-[18px] text-[13px]",
          "data-[state=open]:hover:bg-tbsidebar-accent data-[state=open]:hover:text-primary active:bg-primary/5 active:text-primary-950",
          isActive && "!text-primary font-bold bg-success/5 rounded-md"
        )}
      >
        {item.icon && (
          <span
            className={cn(
              "text-xl",
              !open && "text-lg",
              isActive && "text-success-700"
            )}
          >
            {item.icon}
          </span>
        )}
        <span className={cn(isActive && "text-success-700 font-semibold")}>
          {item.label}
        </span>
        {activeCollapsible === item.id ? (
          <Icon
            icon="mdi:chevron-down"
            className={cn("ml-auto w-4 h-4", isActive && "text-success-700")}
          />
        ) : (
          <Icon
            icon="mdi:chevron-right"
            className={cn("ml-auto w-4 h-4", isActive && "text-success-700")}
          />
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
                    icon="mdi:chevron-down"
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
      const isActive = isParentActive(item.children);

      return (
        <Collapsible
          key={item.id}
          open={activeCollapsible === item.id}
          onOpenChange={(open) => {
            if (open) {
              setActiveCollapsible(item.id);
            } else if (activeCollapsible === item.id) {
              setActiveCollapsible(null);
            }
          }}
          className={cn(
            `group/mcollapsible${item.id}`,
            isActive && "rounded-md"
          )}
        >
          {open && (
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                {CollapsedSidebarMenuItem(item)}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub
                  className={cn(
                    "relative border-l-0",
                    "before:absolute before:left-0 before:top-[10px]",
                    `before:h-[calc(100%-20px)] before:w-[1px] before:bg-warning-500`
                  )}
                >
                  {item.children?.map((subItem) => {
                    const isSubItemActive = isItemActive(subItem.path);
                    return (
                      <SidebarMenuItem key={subItem.id}>
                        <SidebarMenuButton
                          asChild
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(subItem.path);
                          }}
                          className="font-medium hover:bg-transparent hover:text-primary px-0 py-4 text-[13px]"
                        >
                          <span className="cursor-pointer flex items-center">
                            {isSubItemActive && (
                              <Icon
                                icon="fluent:triangle-right-48-filled"
                                className="!w-[8px] !h-[8px] text-warning-800"
                              />
                            )}
                            <span
                              className={cn(
                                isSubItemActive && "text-warning-700 font-bold",
                                !isSubItemActive && "pl-[15px]"
                              )}
                            >
                              {subItem.label}
                            </span>
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
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
                className="w-fit border-none shadow-md"
              >
                <div className="relative pl-2 py-1">
                  <div className="absolute left-2 top-[10px] h-[calc(100%-20px)] w-[1px] bg-warning-200"></div>
                  {item.children?.map((subItem) => {
                    const isSubItemActive = isItemActive(subItem.path);
                    return (
                      <DropdownMenuItem
                        key={subItem.id}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(subItem.path);
                        }}
                        className="flex items-center gap-2"
                      >
                        {isSubItemActive ? (
                          <Icon
                            icon="fluent:triangle-right-48-filled"
                            className="!w-[8px] !h-[8px] text-warning-800"
                          />
                        ) : (
                          <span className="w-[7px]"></span>
                        )}
                        <span
                          className={cn(
                            isSubItemActive
                              ? "text-warning-500 font-medium"
                              : "text-foreground"
                          )}
                        >
                          {subItem.label}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
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
            "hover:!bg-primary/5 font-medium text-foreground hover:text-primary active:bg-primary/5 active:text-primary-950 py-[18px] text-[13px]",
            isItemActive(item.path)
              ? item.depth === 0
                ? "bg-primary/5"
                : "text-primary"
              : "",
            item.depth !== 0 &&
              "hover:bg-transparent hover:text-primary active:bg-transparent",
            !open && "p-0 m-0"
          )}
        >
          <span
            className={cn(
              "cursor-pointer",
              isItemActive(item.path) && "font-semibold text-primary-950"
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
            {item.depth !== 0 && (
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
    <ShadcnSidebar collapsible="icon" className="border-r border-basic-200/10">
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
            className={cn(open && "px-4", !open && "px-3.5", "cursor-pointer")}
            onClick={toggleSidebar}
          >
            {open ? header.expand : header.collapse}
          </SidebarMenuItem>
          {!isLoading && (
            <div className="flex-1 overflow-auto">
              {groups.map((group, index) => renderGroups(group, index))}
            </div>
          )}
          {isLoading && (
            <div className="flex flex-col gap-2 px-2">{SidebarSkeleton()}</div>
          )}

          <SidebarMenuItem className="self-center w-full pr-2">
            <SidebarMenuButton
              tooltip="Glossary"
              className={cn(
                "hover:!bg-primary/5",
                "font-medium text-foreground hover:bg-tbsidebar-accent hover:text-primary py-[18px] text-[13px]",
                "data-[state=open]:hover:bg-tbsidebar-accent data-[state=open]:hover:text-primary active:bg-primary/5 active:text-primary-950",
                isActivePath("/glossary") &&
                  "bg-primary/5 text-primary font-semibold"
              )}
              onClick={() => onNavigate("/glossary")}
            >
              <Icon icon="mdi:help-circle-outline" className="text-lg " />
              Glossary
            </SidebarMenuButton>
            {open && footer.expand}
          </SidebarMenuItem>

          {!open && footer.collapse}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </ShadcnSidebar>
  );
}
