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
        icon: <Icon icon="mage:dashboard-2" className="!w-[18px] !h-[18px]" />,
        path: "/",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "assessment",
        label: "Assessment",
        icon: (
          <Icon
            icon="fluent-mdl2:assessment-group"
            className="!w-[18px] !h-[18px]"
          />
        ),
        path: "/assessment",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "roadmaps",
        label: "Roadmaps",
        icon: (
          <Icon icon="hugeicons:floor-plan" className="!w-[18px] !h-[18px]" />
        ),
        path: "/roadmaps",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "domains",
        label: "Templates",
        icon: (
          <Icon
            icon="material-symbols-light:domain-rounded"
            className="!w-[18px] !h-[18px]"
          />
        ),
        path: "/domains",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "measurement-scale",
        label: "Measurement scale",
        icon: <Icon icon="oui:scale" className="!w-[18px] !h-[18px]" />,
        path: "/measurement-scale",
        permission: isLoading ? false : true,
        depth: 0,
      },

      {
        id: "logs",
        label: "Logs",
        icon: (
          <Icon
            icon="radix-icons:activity-log"
            className="!w-[22x] !h-[22x] pr-1"
          />
        ),
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
        icon: (
          <Icon icon="solar:settings-linear" className="!w-[18px] !h-[18px]" />
        ),
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
            id: "backup",
            label: "Backup",
            path: "/backup",
            permission: true,
            depth: 1,
          },
        ],
      },

      {
        id: "administration",
        label: "Administration",
        icon: (
          <Icon
            icon="clarity:administrator-line"
            className="!w-[18px] !h-[18px]"
          />
        ),
        path: "/administration",
        permission: isLoading ? false : true,
        depth: 0,
      },

      {
        id: "support",
        label: "Support",
        icon: (
          <Icon
            icon="fluent:person-support-28-regular"
            className="!w-[18px] !h-[18px]"
          />
        ),
        path: "/support",
        permission: isLoading ? false : true,
        depth: 0,
      },
    ],
  },
];
