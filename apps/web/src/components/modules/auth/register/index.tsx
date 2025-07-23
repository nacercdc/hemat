"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  checkPasswordStrength,
  DateTimePickerRHF,
  InputRHF,
  PasswordStrengthIndicator,
  PhoneNumberInputRHF,
  SelectRHF,
  useToast,
} from "@etm/web-ui-components";
import { AuthCardHeader } from "../components/AuthCardHeader";
import Link from "next/link";
import PasswordVisibilityToggler from "../../components/PasswordVisibilityToggler";
import { PERSONAL_TITLES } from "../../profile/components/tabs/profile-tab";
import {
  PasswordMinLength,
  PasswordMustIncludeTypes,
} from "../../profile/components/tabs/change-password-tab";
import type { Profile, RegisterProfile } from "~/libs/models/profile.model";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { formatDateToYYYYMMDD } from "@etm/utilities";
import { Country } from "~/libs/models/country.model";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";

interface GenderType {
  id: string;
  name: "Male" | "Female";
}

const genderOptions: GenderType[] = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
];
const GenderSchema = z.object({
  id: z.string(),
  name: z.string(),
});
const titleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const CountrySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const registerFormSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    title: titleSchema.optional(),
    gender: GenderSchema.optional(),
    jobTitle: z.string().min(1, { message: "Job title is required" }),
    dateOfBirth: z.date().optional(),
    country: CountrySchema.optional(),
    phoneNumber: z
      .string()
      .optional()
      .refine((val: string | undefined) => !val || isValidPhoneNumber(val), {
        message: "Invalid phone number",
      }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please provide a valid email address." }),
    password: z
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
    invitationId: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
type RegisterFormInputs = z.infer<typeof registerFormSchema>;

export default function Register() {
  const searchParams = useSearchParams();
  const invitationEmail = searchParams.get("email");
  const invitationIdFromURL = searchParams.get("invitationId");
  const token = searchParams.get("token");
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const toast = useToast();

  const { data: countries, ...countriesState } = useFindAll<Country>({
    path: "/countries",
  });
  const { mutate: registerProfile, ...registerProfileState } = useAddMutation<
    Profile,
    RegisterProfile
  >(`/auth/register`);

  const { control, handleSubmit, watch } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: invitationEmail as string,
      firstName: "",
      lastName: "",
      jobTitle: "",
      invitationId: invitationIdFromURL as string,
    },
  });
  const password = watch("password") || "";
  const onSetPasswordVisibleHandler = () => {
    setPasswordVisible((prev) => !prev);
  };
  const onSetConfirmPasswordVisibleHandler = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };
  const onRegisterHandler = (values: RegisterFormInputs) => {
    registerProfile(
      {
        data: {
          email: invitationEmail as string,
          title: values?.title?.id,
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values?.gender?.id,
          phoneNumber: values?.phoneNumber,
          jobTitle: values.jobTitle,
          country: "USA", //TODO: the need the useFindAll should be public
          invitationId: values.invitationId,
          dateOfBirth: values?.dateOfBirth
            ? formatDateToYYYYMMDD(values?.dateOfBirth)
            : undefined,
          password: values.password,
        },
        isProtected: false,
      },
      {
        onSuccess: () => {
          toast.toast({
            title: "Success",
            message: "You have been registered successfully.",
            variant: "success",
          });
          router.replace("/login");
        },
        onError: (error) => {
          toast.toast({
            message:
              (JSON.parse(error.message) as { error?: string })?.error ??
              "Registration failed.",
            title: "Registration Error",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onRegisterHandler)}
      className="flex flex-col gap-8 h-full"
    >
      <AuthCardHeader
        header="Register"
        subHeader="Enter your detail to register Africa CDC"
      />
      <div className="flex  gap-4">
        <SelectRHF
          name="title"
          control={control}
          displayLabel="Title"
          size="lg"
          labelVariant="medium"
          valueKey="id"
          labelKey="name"
          options={PERSONAL_TITLES.map((title) => ({
            id: title,
            name: title,
          }))}
          placeholder="Select title"
        />
        <InputRHF
          label="First Name"
          placeholder="Enter first name"
          control={control}
          name="firstName"
          labelVariant="medium"
        />

        <InputRHF
          label="Last Name"
          placeholder="Enter last name"
          control={control}
          name="lastName"
          labelVariant="medium"
        />
      </div>
      <div className="flex gap-4">
        <SelectRHF
          name="gender"
          control={control}
          displayLabel="Gender"
          size="lg"
          labelVariant="medium"
          valueKey="id"
          labelKey="name"
          options={genderOptions}
          placeholder="Select gender"
        />
        <InputRHF
          name="jobTitle"
          control={control}
          label="Job title"
          size="lg"
          labelVariant="medium"
          placeholder="Enter job title"
        />
        <DateTimePickerRHF
          name="dateOfBirth"
          control={control}
          showTime={false}
          labelVariant="medium"
          label="Date of birth"
          size="lg"
          placeholder="Enter your date of birth"
          iconDirection="right"
        />
      </div>
      <div className="flex gap-4">
        <SelectRHF
          name="country"
          control={control}
          displayLabel="Country"
          size="lg"
          labelVariant="medium"
          valueKey="id"
          labelKey="name"
          options={(countries?.data ?? []).map((country) => ({
            id: country.name,
            name: country.name,
          }))}
          placeholder="Select country"
          onOpenChange={() => countriesState.refetch()}
          loading={countriesState.isLoading || countriesState.isFetching}
        />
        <PhoneNumberInputRHF
          control={control}
          name="phoneNumber"
          label="Phone Phone"
          labelSize="sm"
          labelVariant="medium"
          size="lg"
          placeholder="Enter your phone phone"
        />
        <InputRHF
          label="Email"
          placeholder="Enter your email"
          control={control}
          name="email"
          labelVariant="medium"
          disabled
        />
      </div>

      <div className="flex  gap-4">
        <InputRHF
          control={control}
          name="password"
          label="Password"
          placeholder="Enter new password"
          size="lg"
          labelVariant="medium"
          type={passwordVisible ? "text" : "password"}
          rightNode={
            <PasswordVisibilityToggler
              visible={passwordVisible}
              onToggle={onSetPasswordVisibleHandler}
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
      </div>
      <div>
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
      </div>
      <div className="flex  gap-4 justify-between z-40">
        <div className="flex flex-row gap-4">
          <span className="text-sm">Do you have an account?</span>
          <Link href={"/login"} className="underline text-sm text-info-500">
            Login
          </Link>
        </div>
        <Button
          type="submit"
          disabled={registerProfileState.isPending}
          loading={registerProfileState.isPending}
        >
          Rejecter
        </Button>
      </div>
    </form>
  );
}
