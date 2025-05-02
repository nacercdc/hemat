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
        id: "assessment",
        label: "Assessment",
        icon: <Icon icon="fluent-mdl2:assessment-group" />,
        path: "/assessment",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "roadmap",
        label: "Roadmap",
        icon: <Icon icon="hugeicons:floor-plan" />,
        path: "/roadmap",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "domains",
        label: "Domains",
        icon: <Icon icon="material-symbols-light:domain-rounded" />,
        path: "/domains",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "measurement-scale",
        label: "Measurement scale",
        icon: <Icon icon="oui:scale" />,
        path: "/measurement-scale",
        permission: isLoading ? false : true,
        depth: 0,
      },

      {
        id: "logs",
        label: "logs",
        icon: <Icon icon="radix-icons:activity-log" />,
        permission: [true].some(Boolean),
        depth: 0,
        children: [
          {
            id: "activity",
            label: "Activity",
            path: "/activity",
            permission: true,
            depth: 1,
          },
          {
            id: "sms",
            label: "SMS",
            path: "/sms",
            permission: true,
            depth: 1,
          },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Icon icon="solar:settings-linear" />,
        permission: [true].some(Boolean),
        depth: 0,
        children: [
          {
            id: "profile",
            label: "Profile",
            path: "/profile",
            permission: true,
            depth: 1,
          },
          {
            id: "language",
            label: "Language",
            path: "/language",
            permission: true,
            depth: 1,
          },

          {
            id: "Backup",
            label: "Backup",
            path: "/Backup",
            permission: true,
            depth: 1,
          },
        ],
      },

      {
        id: "administration",
        label: "Administration",
        icon: <Icon icon="clarity:administrator-line" />,
        path: "/administration",
        permission: isLoading ? false : true,
        depth: 0,
      },

      {
        id: "support",
        label: "Support",
        icon: <Icon icon="fluent:person-support-28-regular" />,
        path: "/support",
        permission: isLoading ? false : true,
        depth: 0,
      },
    ],
  },
];
