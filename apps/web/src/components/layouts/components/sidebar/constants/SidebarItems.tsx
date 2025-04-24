import type { AppAbilityType } from "~/providers/ability/casl/ability";
import { Icon } from "@iconify/react";
import type { Group } from "@etm/web-ui-components";

// TODO: Remove isLoading as soon as we have all permission actions and subjects
export const groups = (
  _ability: AppAbilityType,
  isLoading: boolean
): Group[] => [
  {
    menuItems: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <Icon icon="material-symbols-light:dashboard-outline-rounded" />,
        path: "/",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "organizations",
        label: "Organizations",
        icon: <Icon icon="fluent:organization-28-regular" />,
        path: "/organizations",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "employees",
        label: "Employees",
        icon: <Icon icon="system-uicons:users" />,
        path: "/employees",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "cases",
        label: "Cases",
        icon: <Icon icon="material-symbols-light:folder-outline" />,
        path: "/cases",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "consultants",
        label: "Consultants",
        icon: <Icon icon="oui:app-users-roles" />,
        path: "/consultants",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "administrations",
        label: "Administrations",
        icon: <Icon icon="clarity:administrator-line" />,
        permission: [true].some(Boolean),
        depth: 0,
        children: [
          {
            id: "users",
            label: "Users",
            path: "/users",
            icon: <Icon icon="heroicons:users" />,
            permission: true,
            depth: 1,
          },
          {
            id: "roles",
            label: "Roles",
            path: "/roles",
            icon: <Icon icon="oui:app-users-roles" />,
            permission: true,
            depth: 1,
          },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Icon icon="mdi-light:settings" />,
        path: "/settings",
        permission: isLoading ? false : true,
        depth: 0,
      },
    ],
  },
];
