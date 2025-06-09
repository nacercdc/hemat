/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Button,
  Checkbox,
  InputRHF,
  TextAreaRHF,
} from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { PermissionType } from "~/components/modules/administration/types";
import { cn } from "~/utils/cn.util";

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

const RoleFormSchema = z.object({
  name: z.string().min(1, { message: "Role name is required" }),
  description: z.string().min(1, { message: "Role description is required" }),
});

export type RoleFormData = z.infer<typeof RoleFormSchema>;
export type Role = RoleFormData & { createdAt: Date };

interface Props {
  role?: RoleFormData;
  loading?: boolean;
  rolePermissions?: Record<string, Partial<Record<PermissionType, boolean>>>;
  modules: PermissionModule[];
  onSubmitRoleFormHandler: (
    roleName: string,
    roleDescription: string,
    permissions: Record<string, Record<PermissionType, boolean>>
  ) => void;
  onCloseModal?: () => void;
  onRefetch?: () => void;
}

export function RoleForm({
  role,
  loading = false,
  rolePermissions = {},
  modules,
  onSubmitRoleFormHandler,
  onCloseModal,
}: Props) {
  const { control, handleSubmit, reset } = useForm<RoleFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(RoleFormSchema),
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
    if (role) reset(role);
  }, [role, reset]);

  const onSubmitHandler = (values: RoleFormData) => {
    if (isAllUnchecked()) {
      setNoPermissionSelected(true);

      return;
    }
    onSubmitRoleFormHandler(values.name, values.description, permissionState);
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

  const handleToggleAll = () => {
    if (noPermissionSelected) setNoPermissionSelected(false);

    const allChecked = isAllChecked();
    const newState = { ...permissionState };

    modules.forEach((module) =>
      permissionTypes.forEach((type) => {
        newState[module.name]![type] = !allChecked;
      })
    );

    setPermissionState(newState);
  };

  const isAllChecked = () => {
    return (
      modules.every((module) => isAllModuleChecked(module.name)) &&
      permissionTypes.every((permission) => isAllTypeChecked(permission))
    );
  };

  const isAllUnchecked = () => {
    return modules.every((module) =>
      permissionTypes.every((type) => !permissionState[module.name]?.[type])
    );
  };

  const isAllTypeChecked = (type: PermissionType) => {
    return modules.every((module) => permissionState[module.name]?.[type]);
  };

  const isAllModuleChecked = (moduleName: string) => {
    return permissionTypes.every((type) => permissionState[moduleName]?.[type]);
  };

  const gridTemplateColumns = `minmax(180px, 1fr) repeat(${permissionTypes.length}, minmax(80px, 0.5fr))`;

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="rounded-md flex flex-col w-full gap-5 max-h-[80vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-5 px-7">
        <InputRHF
          name="name"
          control={control}
          label="Name"
          size="xl"
          labelVariant="medium"
          placeholder="Enter role name"
        />
        <TextAreaRHF
          name="description"
          control={control}
          label="Description"
          rows={4}
          labelVariant="medium"
          placeholder="Enter role description"
        />
        <div className="self-end">
          <Checkbox
            checked={isAllChecked()}
            onCheckedChange={() => handleToggleAll()}
            size="lg"
            label="Select All"
          />
        </div>
      </div>
      <div className="relative w-full px-7">
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
      <div className="flex justify-end gap-3 bg-dark-lighter/10 py-3 px-7">
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" loading={loading}>
          {role ? "Update" : "Add"}
        </Button>
      </div>
    </form>
  );
}
