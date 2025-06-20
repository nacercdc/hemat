"use client";

import type { PasswordIncludeType } from "@etm/web-ui-components";
import {
  Button,
  checkPasswordStrength,
  InputRHF,
  PasswordStrengthIndicator,
  useToast,
} from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { PasswordChange } from "~/libs/models/user.model";
import { usePatchMutation } from "~/libs/tanstack-api-query/hooks/usePatchMutation";
import { useGetMe } from "~/providers/me/useGetMe";
import ChangePasswordTabSkeleton from "./ChangePasswordSkeleton";
import PasswordVisibilityToggler from "~/components/modules/components/PasswordVisibilityToggler";
const PasswordMinLength = 8;
const PasswordMustIncludeTypes: PasswordIncludeType[] = [
  "Number",
  "SpecialChar",
  "UpperCase",
  "LowerCase",
];

const changePasswordFormSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(1, { message: "New password is required" })
      .refine(
        (value) => {
          const strength = checkPasswordStrength(
            value,
            PasswordMinLength,
            PasswordMustIncludeTypes
          );
          return strength === PasswordMustIncludeTypes.length + 1;
        },
        {
          message: "Password is not strong enough. Please improve it.",
        }
      ),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

export default function ChangePasswordTab() {
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { toast } = useToast();
  const { data: currentUser, ...currentUserState } = useGetMe();

  const { mutate: updatePassword, ...updatePasswordState } = usePatchMutation<
    unknown,
    PasswordChange
  >(`/users/${currentUser?.id}/update-password`);

  const { control, handleSubmit, watch } = useForm<ChangePasswordFormData>({
    values: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "all",
    resolver: zodResolver(changePasswordFormSchema),
  });

  const password = watch("newPassword");

  const onSetOldPasswordVisibleHandler = () => {
    setOldPasswordVisible((prev) => !prev);
  };

  const onSetNewPasswordVisibleHandler = () => {
    setNewPasswordVisible((prev) => !prev);
  };

  const onSetConfirmPasswordVisibleHandler = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const onSubmitHandler = (values: ChangePasswordFormData) => {
    updatePassword(
      {
        data: {
          password: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "You password has been changed successfully.",
            variant: "success",
          });
        },
      }
    );
  };

  if (currentUserState.isLoading) {
    return <ChangePasswordTabSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-0">
        <span className="font-bold text-lg">Change password</span>
        <span className="text-basic-500 text-sm">
          Modify your current password
        </span>
      </div>
      <form
        className="flex flex-col gap-5 w-full sm:w-11/12 lg:w-4/5 xl:w-3/4 2xl:w-1/2"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <InputRHF
          control={control}
          name="oldPassword"
          label="Current password"
          placeholder="Enter current password"
          size="lg"
          labelVariant="medium"
          type={oldPasswordVisible ? "text" : "password"}
          rightNode={
            <PasswordVisibilityToggler
              visible={oldPasswordVisible}
              onToggle={onSetOldPasswordVisibleHandler}
            />
          }
        />
        <InputRHF
          control={control}
          name="newPassword"
          label="New password"
          placeholder="Enter new password"
          size="lg"
          labelVariant="medium"
          type={newPasswordVisible ? "text" : "password"}
          rightNode={
            <PasswordVisibilityToggler
              visible={newPasswordVisible}
              onToggle={onSetNewPasswordVisibleHandler}
            />
          }
        />
        <InputRHF
          control={control}
          name="confirmPassword"
          label="Confirm password"
          placeholder="Enter confirm password"
          size="lg"
          labelVariant="medium"
          type={confirmPasswordVisible ? "text" : "password"}
          rightNode={
            <PasswordVisibilityToggler
              visible={confirmPasswordVisible}
              onToggle={onSetConfirmPasswordVisibleHandler}
            />
          }
        />
        <div className="flex flex-row gap-6">
          <div className="flex flex-col">
            <span></span>
          </div>
        </div>
        <div className="flex flex-col gap-0">
          <span className="font-bold text-lg">Password Strength</span>
          <span className="text-basic-500 text-sm">
            Password strength check
          </span>
        </div>
        <PasswordStrengthIndicator
          password={password}
          minLength={PasswordMinLength}
          mustIncludeTypes={PasswordMustIncludeTypes}
        />
        <div className="w-full flex justify-end">
          <Button type="submit" loading={updatePasswordState.isPending}>
            Change
          </Button>
        </div>
      </form>
    </div>
  );
}
