/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Button,
  Checkbox,
  InputRHF,
  PhoneNumberInputRHF,
  SelectRHF,
} from "@etm/web-ui-components";
import { isValidPhoneNumber } from "libphonenumber-js";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Role } from "~/libs/models/role.model";
import { cn } from "~/utils/cn.util";
import type { PermissionType } from "~/components/modules/administration/types";

// Dummy temporary Role data
const roleOptions: Partial<Role>[] = [
  { id: "super-administrator", name: "Super Admininistrator" },
];

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
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid Email address" }),
  role: RoleSchema,
  phoneNumber: z
    .string()
    .min(1, { message: "Mobile phone is required" })
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

export type UserFormData = z.infer<typeof UserFormSchema>;

interface Props {
  user?: UserFormData;
  loading?: boolean;
  rolePermissions?: Record<string, Partial<Record<PermissionType, boolean>>>;
  modules: PermissionModule[];
  onSubmitUserFormHandler: (
    permissions: Record<string, Record<PermissionType, boolean>>
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
      firstName: "",
      lastName: "",
      email: "",
    },
    resolver: zodResolver(UserFormSchema),
    mode: "onChange",
  });

  const [noPermissionSelected, setNoPermissionSelected] = useState(false);

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

  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  const onSubmitHandler = () => {
    if (isAllUnchecked()) {
      setNoPermissionSelected(true);

      return;
    }
    onSubmitUserFormHandler(permissionState);
  };

  const handleCheckboxChange = (moduleName: string, type: PermissionType) => {
    if (noPermissionSelected) setNoPermissionSelected(false);

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
    if (noPermissionSelected) setNoPermissionSelected(false);

    const allChecked = permissionTypes.every(
      (type) => permissionState[moduleName]?.[type]
    );
    const newState = { ...permissionState };

    permissionTypes.forEach((type) => {
      newState[moduleName]![type] = !allChecked;
    });

    setPermissionState(newState);
  };

  const isAllUnchecked = () => {
    return modules.every((module) =>
      permissionTypes.every((type) => !permissionState[module.name]?.[type])
    );
  };

  const isAllModuleChecked = (moduleName: string) => {
    return permissionTypes.every((type) => permissionState[moduleName]?.[type]);
  };

  const gridTemplateColumns = `minmax(180px, 1fr) repeat(${permissionTypes.length}, minmax(80px, 0.5fr))`;

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="rounded-md flex flex-col w-full gap-5"
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
        <PhoneNumberInputRHF
          control={control}
          name="phoneNumber"
          label="Phone Phone"
          labelVariant="medium"
          size="xl"
          placeholder="Enter your phone phone"
        />
      </div>
      <div className="px-7">
        <SelectRHF
          name="role"
          control={control}
          displayLabel="Role"
          size="xl"
          labelVariant="medium"
          valueKey="id"
          labelKey="name"
          options={roleOptions}
          placeholder="Select user's role"
        />
      </div>
      <span className="px-7 text-[16px] font-bold">Select Permissions</span>
      <div className="relative overflow-x-auto w-full px-7">
        <div
          className="grid gap-3 items-center py-4 px-2 w-full rounded-sm rounded-b-none bg-primary-50"
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
                "grid gap-3 items-center py-4 px-2 w-full shadow-none rounded-sm rounded-t-none bg-primary-50"
              )}
              style={{ gridTemplateColumns }}
            >
              <Checkbox
                checked={isAllModuleChecked(module.name)}
                onCheckedChange={() => handleToggleAllModule(module.name)}
                size="lg"
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
                    size="lg"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {noPermissionSelected && (
        <span className="text-destructive text-xs px-7">
          A role must have at least one permission.
        </span>
      )}
      <div className="flex justify-end gap-3 bg-primary-50 py-3 px-7">
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
