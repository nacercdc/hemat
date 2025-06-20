/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "~/utils/cn.util";
import {
  Button,
  Checkbox,
  InputRHF,
  PhoneNumberInputRHF as _,
  MultiSelectRHF,
} from "@etm/web-ui-components";
import type { Role } from "~/libs/models/role.model";
import type { PermissionType } from "~/components/modules/administration/types";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { generatePassword } from "~/components/modules/administration/utils";

export interface PermissionModule {
  name: string;
  label: string;
}

export const permissionTypes: PermissionType[] = [
  "create",
  "update",
  "delete",
  "read",
  "restore",
];

const RoleSchema = z.object({
  id: z.string().min(1, { message: "Role ID is required" }),
  name: z.string().min(1, { message: "Role name is required" }),
});

const UserFormSchema = z.object({
  title: z.string().min(1, { message: "Title name is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid Email address" }),
  password: z.string().min(1, { message: "Password is required" }).optional(),
  roles: z.array(RoleSchema).min(1, { message: "At least select one role" }),
});

export type UserFormData = z.infer<typeof UserFormSchema>;

interface Props {
  user?: UserFormData;
  loading?: boolean;
  rolePermissions?: Record<string, Partial<Record<PermissionType, boolean>>>;
  modules: PermissionModule[];
  onSubmitUserFormHandler: (
    permissions: Record<string, Record<PermissionType, boolean>>,
    values: UserFormData
  ) => void;
  onCloseModal?: () => void;
  onRefetch?: () => void;
}

export function UserForm({
  user,
  loading = false,
  rolePermissions = {},
  modules,
  onSubmitUserFormHandler,
  onCloseModal,
}: Props) {
  const { control, handleSubmit, reset } = useForm<UserFormData>({
    defaultValues: {
      title: "Mrs",
      firstName: "",
      lastName: "",
      email: "",
      password: generatePassword(),
    },
    resolver: zodResolver(UserFormSchema),
    mode: "onChange",
  });

  const [permissionState, setPermissionState] = useState<
    Record<string, Record<PermissionType, boolean>>
  >(() => {
    const state: Record<string, Record<PermissionType, boolean>> = {};

    modules.forEach((module) => {
      state[module.name] = {} as Record<PermissionType, boolean>;
      permissionTypes.forEach((type) => {
        state[module.name]![type] =
          rolePermissions[module.name]?.[type] || false;
      });
    });

    return state;
  });

  const { data: roles, ...rolesState } = useFindAll<QueryManyResponse<Role>>({
    path: "/roles",
    queries: {
      limit: 100, //TODO: need all here
      page: 1,
      include: ["permissions"],
    },
  });

  useEffect(() => {
    //TODO: this is wrong: title should not be updated like this
    if (user) reset({ ...user, title: "Mrs" });
  }, [user, reset]);

  const onSubmitHandler = (values: UserFormData) => {
    onSubmitUserFormHandler(permissionState, values);
  };

  const handleCheckboxChange = (moduleName: string, type: PermissionType) => {
    const checked = !permissionState[moduleName]?.[type];
    const newState = {
      ...permissionState,
      [moduleName]: {
        ...permissionState[moduleName],
        [type]: checked,
      },
    };

    if (type !== "read" && checked) {
      newState[moduleName]!.read = true;
    } else if (type === "read" && !checked) {
      Object.keys(permissionState[moduleName]!).forEach((type) => {
        newState[moduleName]![type as PermissionType] = false;
      });
    }

    setPermissionState(
      newState as Record<string, Record<PermissionType, boolean>>
    );
  };

  const handleToggleAllModule = (moduleName: string) => {
    const allChecked = permissionTypes.every(
      (type) => permissionState[moduleName]?.[type]
    );
    const newState = { ...permissionState };

    permissionTypes.forEach((type) => {
      newState[moduleName]![type] = !allChecked;
    });

    setPermissionState(newState);
  };

  const isAllModuleChecked = (moduleName: string) => {
    return permissionTypes.every((type) => permissionState[moduleName]?.[type]);
  };

  const gridTemplateColumns = `minmax(180px, 1fr) repeat(${permissionTypes.length}, minmax(80px, 0.5fr))`;

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="rounded-md flex flex-col w-full max-h-[80vh] gap-5"
    >
      <div className="flex gap-2 px-7">
        <InputRHF
          name="firstName"
          control={control}
          label="First Name"
          size="xl"
          labelVariant="medium"
          placeholder="Enter first name"
        />
        <InputRHF
          name="lastName"
          control={control}
          label="Last Name"
          size="xl"
          labelVariant="medium"
          placeholder="Enter last name"
        />
      </div>
      <div className="flex gap-2 px-7">
        <InputRHF
          name="email"
          control={control}
          label="Email"
          size="xl"
          labelVariant="medium"
          placeholder="Enter email address"
        />
      </div>
      <div className="px-7">
        <MultiSelectRHF
          name="roles"
          control={control}
          displayLabel="Role"
          size="xl"
          labelVariant="medium"
          valueKey="id"
          labelKey="name"
          options={(roles?.data as unknown as Role[]) || []}
          placeholder="Select user's roles"
          onOpenChange={() => rolesState.refetch}
          loading={rolesState.isFetching || rolesState.isLoading}
        />
      </div>
      <span className="px-7 text-[16px] font-bold">Select Permissions</span>
      <div className="relative overflow-x-auto w-full px-7">
        <div
          className="grid gap-3 items-center py-4 px-2 w-full rounded-sm rounded-b-none bg-dark-lighter/5"
          style={{ gridTemplateColumns }}
        >
          <div className="font-medium text-dark text-sm">Module</div>
          {permissionTypes.map((type) => (
            <span key={type} className="font-medium text-sm">
              {type[0]?.toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>

        <div>
          {modules.map((module) => (
            <div
              key={module.name}
              className={cn(
                "grid gap-3 items-center py-4 px-2 w-full shadow-none rounded-sm rounded-t-none bg-dark-lighter/5"
              )}
              style={{ gridTemplateColumns }}
            >
              <Checkbox
                checked={isAllModuleChecked(module.name)}
                onCheckedChange={() => handleToggleAllModule(module.name)}
                size="md"
                label={module.label}
              />

              {permissionTypes.map((type) => (
                <div
                  key={`${module.name}-${type}`}
                  className="flex justify-center"
                >
                  <Checkbox
                    checked={permissionState[module.name]?.[type]}
                    onCheckedChange={() =>
                      handleCheckboxChange(module.name, type)
                    }
                    size="md"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 bg-dark-lighter/5 py-3 px-7">
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" loading={loading}>
          {user ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
}
