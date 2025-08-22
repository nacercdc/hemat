import type { AppAbilityType } from "~/providers/ability/casl/ability";
import { Icon } from "@iconify/react";
import type { Group } from "@etm/web-ui-components";
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from "~/providers/ability/casl/types";

// TODO: Remove isLoading as soon as we have all permission actions and subjects
export const groups = (ability: AppAbilityType): Group[] => [
  {
    menuItems: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <Icon icon="mage:dashboard-2" className="!w-[18px] !h-[18px]" />,
        path: "/",
        permission: ability.can(
          PermissionActionEnum.READ,
          PermissionSubjectEnum.DASHBOARD
        ),
        depth: 0,
      },
      {
        id: "measurement-scale",
        label: "Measurement Scale",
        icon: (
          <Icon icon="hugeicons:chart-02" className="!w-[18px] !h-[18px]" />
        ),
        path: "/measurement-scale",
        permission: ability.can(
          PermissionActionEnum.READ,
          PermissionSubjectEnum.MEASUREMENT_SCALE
        ),
        depth: 0,
      },
      {
        id: "templates",
        label: "Templates",
        icon: (
          <Icon
            icon="material-symbols-light:domain-rounded"
            className="!w-[18px] !h-[18px]"
          />
        ),
        path: "/templates",
        permission: ability.can(
          PermissionActionEnum.READ,
          PermissionSubjectEnum.ASSESSMENT_DOMAIN
        ),
        depth: 0,
      },
      {
        id: "assessment",
        label: "Assessments",
        icon: (
          <Icon
            icon="fluent-mdl2:assessment-group"
            className="!w-[18px] !h-[18px]"
          />
        ),
        path: "/assessment",
        permission: ability.can(
          PermissionActionEnum.READ,
          PermissionSubjectEnum.ASSESSMENT
        ),
        depth: 0,
      },
      {
        id: "roadmaps",
        label: "Roadmaps",
        icon: (
          <Icon icon="hugeicons:floor-plan" className="!w-[18px] !h-[18px]" />
        ),
        path: "/roadmaps",
        permission: ability.can(
          PermissionActionEnum.READ,
          PermissionSubjectEnum.ROADMAP
        ),
        depth: 0,
      },

      // {
      //   id: "logs",
      //   label: "Logs",
      //   icon: (
      //     <Icon
      //       icon="radix-icons:activity-log"
      //       className="!w-[22x] !h-[22x] pr-1"
      //     />
      //   ),
      //   permission: [true].some(Boolean),
      //   depth: 0,
      //   children: [
      //     {
      //       id: "activity",
      //       label: "Activity",
      //       path: "/activity",
      //       permission: true,
      //       depth: 1,
      //     },
      //     {
      //       id: "sms",
      //       label: "SMS",
      //       path: "/sms",
      //       permission: true,
      //       depth: 1,
      //     },
      //   ],
      // },

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
        permission: [
          ability.can(PermissionActionEnum.READ, PermissionSubjectEnum.USER),
          ability.can(PermissionActionEnum.READ, PermissionSubjectEnum.ROLE),
        ].some(Boolean),
        depth: 0,
      },
      {
        id: "settings",
        label: "Settings",
        icon: (
          <Icon icon="solar:settings-linear" className="!w-[18px] !h-[18px]" />
        ),
        permission: [
          ability.can(PermissionActionEnum.READ, PermissionSubjectEnum.PROFILE),
          ability.can(
            PermissionActionEnum.READ,
            PermissionSubjectEnum.LANGUAGE
          ),
        ].some(Boolean),
        depth: 0,
        children: [
          {
            id: "profile",
            label: "Profile",
            path: "/profile",
            permission: ability.can(
              PermissionActionEnum.READ,
              PermissionSubjectEnum.PROFILE
            ),
            depth: 1,
          },
          {
            id: "language",
            label: "Language",
            path: "/language",
            permission: ability.can(
              PermissionActionEnum.READ,
              PermissionSubjectEnum.LANGUAGE
            ),
            depth: 1,
          },
        ],
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
        permission: ability.can(
          PermissionActionEnum.READ,
          PermissionSubjectEnum.SUPPORT
        ),
        depth: 0,
      },
      {
        id: "invitations",
        label: "Invitations",
        icon: (
          <Icon icon="mingcute:invite-line" className="!w-[18px] !h-[18px]" />
        ),
        path: "/invitations",
        permission: ability.can(
          PermissionActionEnum.READ,
          PermissionSubjectEnum.INVITATION
        ),
        depth: 0,
      },
    ],
  },
];
