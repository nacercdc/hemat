"use client";

import React, { useState } from "react";
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
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
} from "../../shadcn-ui";
import { Icon } from "@iconify/react";

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
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
  header: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  loadingIndicator?: React.ReactNode;
}

export function Sidebar({
  groups,
  userPermissions,
  header,
  footer,
  isLoading,
  loadingIndicator,
}: Props) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [openCollapsibles, setOpenCollapsibles] = useState<
    Record<string, boolean>
  >({});

  const toggleCollapsible = (id: string) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isItemActive = (itemId: string) => {
    return itemId === activeItemId;
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
                <SidebarMenu>
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
                {item.icon && <span>{item.icon}</span>}
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
          isActive={isItemActive(item.id)}
          onClick={() => setActiveItemId(item.id)}
        >
          <a href={item.path}>
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </a>
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>{header}</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group, index) => renderGroups(group, index))}
      </SidebarContent>
      {footer && <SidebarSeparator />}
      {footer && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>{footer}</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
      <SidebarRail />
    </ShadcnSidebar>
  );
}
