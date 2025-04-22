import type { AppAbilityType } from "~/providers/ability/casl/ability";
import { Icon } from "@iconify/react";
import {
  PermissionActionEnum,
  PermissionSubjectEnum,
} from "~/providers/ability/casl/types";
import type { Group } from "@etm/web-ui-components";

// TODO: Remove isLoading as soon as we have all permission actions and subjects
export const groups = (
  ability: AppAbilityType,
  isLoading: boolean
): Group[] => [
  {
    menuItems: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <Icon icon="majesticons:home-analytics-line" />,
        path: "/",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "sales",
        label: "Sales",
        icon: <Icon icon="basil:invoice-outline" />,
        permission: [
          ability.can(
            PermissionActionEnum.VIEW,
            PermissionSubjectEnum.Customers
          ),
          ability.can(
            PermissionActionEnum.VIEW,
            PermissionSubjectEnum.Invoices
          ),
        ].some(Boolean),
        depth: 0,
        children: [
          {
            id: "customers",
            label: "Customers",
            path: "/customers",
            permission: ability.can(
              PermissionActionEnum.VIEW,
              PermissionSubjectEnum.Customers
            ),
            depth: 1,
          },
          {
            id: "invoice",
            label: "Invoice",
            path: "/invoices",
            permission: ability.can(
              PermissionActionEnum.VIEW,
              PermissionSubjectEnum.Invoices
            ),
            depth: 1,
          },
        ],
      },
      {
        id: "expenses",
        label: "Expenses",
        icon: <Icon icon="iconamoon:invoice" />,
        permission: [
          ability.can(
            PermissionActionEnum.VIEW,
            PermissionSubjectEnum.Suppliers
          ),
          ability.can(PermissionActionEnum.VIEW, PermissionSubjectEnum.Bills),
          ability.can(
            PermissionActionEnum.VIEW,
            PermissionSubjectEnum.Expenses
          ),
        ].some(Boolean),
        depth: 0,
        children: [
          {
            id: "supplier",
            label: "Suppliers",
            path: "/suppliers",
            permission: ability.can(
              PermissionActionEnum.VIEW,
              PermissionSubjectEnum.Suppliers
            ),
            depth: 1,
          },
          {
            id: "bill",
            label: "Bills",
            path: "/bills",
            permission: ability.can(
              PermissionActionEnum.VIEW,
              PermissionSubjectEnum.Bills
            ),
            depth: 1,
          },
          {
            id: "expense",
            label: "Expense",
            path: "/expenses",
            permission: ability.can(
              PermissionActionEnum.VIEW,
              PermissionSubjectEnum.Expenses
            ),
            depth: 1,
          },
        ],
      },
      {
        id: "product-and-service",
        label: "Product and Service",
        icon: <Icon icon="fluent-mdl2:product" />,
        path: "/product-and-service",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "accounts",
        label: "Accounts",
        icon: <Icon icon="mdi:chart-box-outline" />,
        path: "/accounts",
        permission: ability.can(
          PermissionActionEnum.VIEW,
          PermissionSubjectEnum.Accounts
        ),
        depth: 0,
      },
      {
        id: "employees",
        label: "Employees",
        icon: <Icon icon="ci:users-group" />,
        path: "/employees",
        permission: ability.can(
          PermissionActionEnum.VIEW,
          PermissionSubjectEnum.Employees
        ),
        depth: 0,
      },
      {
        id: "report",
        label: "Report",
        icon: <Icon icon="heroicons-outline:document-report" />,
        path: "/report",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "edca-report",
        label: "EDCA Report",
        icon: <Icon icon="mage:dashboard-chart" />,
        path: "/edca-report",
        permission: isLoading ? false : true,
        depth: 0,
      },
      {
        id: "taxes",
        label: "Taxes",
        icon: <Icon icon="tabler:tax" />,
        path: "/taxes",
        permission: ability.can(
          PermissionActionEnum.VIEW,
          PermissionSubjectEnum.Taxes
        ),
        depth: 0,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Icon icon="solar:settings-linear" />,
        path: "/settings",
        permission: ability.can(
          PermissionActionEnum.VIEW,
          PermissionSubjectEnum.Settings
        ),
        depth: 0,
      },
      {
        id: "administrator",
        label: "Administrator",
        icon: <Icon icon="clarity:administrator-line" />,
        path: "/administrator",
        permission: isLoading ? false : true,
        depth: 0,
        children: [
          {
            id: "users",
            label: "Users",
            path: "/users",
            permission: ability.can(
              PermissionActionEnum.VIEW,
              PermissionSubjectEnum.Users
            ),
            depth: 1,
          },
          {
            id: "roles",
            label: "Roles",
            path: "/roles",
            permission: isLoading ? false : true,
            depth: 1,
          },
        ],
      },
    ],
  },
];
