"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import type { CountryCode } from "libphonenumber-js";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  checkPasswordStrength,
  InputRHF,
  PasswordStrengthIndicator,
  PhoneNumberInputRHF,
  SelectRHF,
  useToast,
} from "@etm/web-ui-components";
import { AuthCardHeader } from "../components/AuthCardHeader";
import Link from "next/link";
import PasswordVisibilityToggler from "../../components/PasswordVisibilityToggler";
import {
  PasswordMinLength,
  PasswordMustIncludeTypes,
} from "../../profile/components/tabs/change-password-tab";
import type { Profile, RegisterProfile } from "~/libs/models/profile.model";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import type { Country } from "~/libs/models/country.model";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { serializeFormData } from "~/utils/object.util";
import { PERSONAL_TITLES } from "~/libs/models/user.model";

interface GenderType {
  id: string;
  name: "Male" | "Female";
}

const genderOptions: GenderType[] = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
];
const GenderSchema = z.object(
  {
    id: z.string(),
    name: z.string(),
  },
  { required_error: "Gender is required" }
);
const titleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const CountrySchema = z.object(
  {
    id: z.string(),
    name: z.string(),
  },
  { required_error: "Country is required" }
);

const registerFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .refine((val) => isNaN(Number(val)), {
        message: "First name cannot be a number",
      }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .refine((val) => isNaN(Number(val)), {
        message: "Last name cannot be a number",
      }),
    middleName: z
      .string()
      .optional()
      .refine((val) => !val || isNaN(Number(val)), {
        message: "Middle name cannot be a number",
      }),
    title: titleSchema.optional(),
    gender: GenderSchema,
    jobTitle: z.string().min(1, { message: "Job title is required" }),
    country: CountrySchema,
    phoneNumber: z
      .string({ message: "Phone number is required" })
      .refine((val: string | undefined) => !val || isValidPhoneNumber(val), {
        message: "Invalid phone number",
      }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please provide a valid email address." }),
    profession: z.string().min(1, { message: "Profession is required." }),
    password: z
      .string()
      .min(1, { message: "New password is required" })
      .refine(
        (value) =>
          checkPasswordStrength(
            value,
            PasswordMinLength,
            PasswordMustIncludeTypes
          ) ===
          PasswordMustIncludeTypes.length + 1,
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

  const invitationEmail = searchParams.get("email") || "";
  const invitationIdFromURL = searchParams.get("invitationId");
  const router = useRouter();
  const toast = useToast();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { data: countries, ...countriesState } = useFindAll<Country>({
    path: "/countries",
    isProtected: false,
    queries: {
      take: 100,
    },
  });

  const { mutate: registerProfile, ...registerProfileState } = useAddMutation<
    Profile,
    RegisterProfile
  >(`/auth/register`);

  const { control, handleSubmit, watch } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: invitationEmail ?? "",
      firstName: "",
      lastName: "",
      middleName: "",
      jobTitle: "",
      password: "",
      profession: "",
      confirmPassword: "",
      invitationId: invitationIdFromURL ?? "",
    },
  });

  const password = watch("password") ?? "";

  const onRegisterHandler = (values: RegisterFormInputs) => {
    const serializedData: RegisterProfile = serializeFormData({
      email: invitationEmail ? invitationEmail : values.email,
      title: values?.title?.id,
      firstName: values.firstName,
      middleName: values.middleName,
      lastName: values.lastName,
      profession: values.profession,
      gender: values?.gender?.id,
      phoneNumber: values?.phoneNumber,
      jobTitle: values.jobTitle,
      country: values.country?.id,
      invitationId: values.invitationId ?? null,
      password: values.password,
    });

    registerProfile(
      {
        data: serializedData,
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
      className="flex flex-col gap-8 h-full overflow-y-auto w-full"
    >
      <AuthCardHeader
        header="Register"
        subHeader="Enter your detail to register HIEMAT"
      />

      <div className="flex flex-col lg:flex-row gap-4">
        <div>
          <SelectRHF
            name="title"
            control={control}
            displayLabel="Title"
            labelVariant="medium"
            valueKey="id"
            labelKey="name"
            options={PERSONAL_TITLES.map((title) => ({
              id: title,
              name: title,
            }))}
            placeholder="Select title"
          />
        </div>
        <InputRHF
          label="First Name"
          placeholder="Enter first name"
          control={control}
          name="firstName"
          labelVariant="medium"
          required
        />
        <InputRHF
          label="Middle Name"
          placeholder="Enter middle name"
          control={control}
          name="middleName"
          labelVariant="medium"
        />
        <InputRHF
          label="Last Name"
          placeholder="Enter last name"
          control={control}
          name="lastName"
          labelVariant="medium"
          required
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
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
          required
        />
        <InputRHF
          name="profession"
          label="Profession"
          placeholder="Enter your profession"
          control={control}
          labelVariant="medium"
          required
        />
        <InputRHF
          name="jobTitle"
          control={control}
          label="Job title"
          size="lg"
          labelVariant="medium"
          placeholder="Enter job title"
          required
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <SelectRHF
          name="country"
          control={control}
          displayLabel="Country"
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
          required
        />
        <InputRHF
          label="Email"
          placeholder="Enter your email"
          control={control}
          name="email"
          labelVariant="medium"
          disabled={!!invitationIdFromURL || !!invitationEmail}
          required
        />
        <PhoneNumberInputRHF
          control={control}
          name="phoneNumber"
          label="Phone Number"
          labelSize="sm"
          labelVariant="medium"
          size="lg"
          placeholder="Enter your phone phone"
          options={(countries?.data ?? []).map((country) => ({
            label: country.name ?? "",
            value: country.code as CountryCode,
          }))}
          required
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
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
              onToggle={() => setPasswordVisible((prev) => !prev)}
            />
          }
          required
        />
        <InputRHF
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm password"
          size="lg"
          labelVariant="medium"
          type={confirmPasswordVisible ? "text" : "password"}
          rightNode={
            <PasswordVisibilityToggler
              visible={confirmPasswordVisible}
              onToggle={() => setConfirmPasswordVisible((prev) => !prev)}
            />
          }
          required
        />
      </div>

      <div>
        <div className="flex flex-col gap-1">
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

      <div className="flex flex-col-reverse lg:flex-row gap-4 justify-between z-40">
        <div className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline text-info-500">
            Login
          </Link>
        </div>
        <Button
          type="submit"
          disabled={registerProfileState.isPending}
          loading={registerProfileState.isPending}
        >
          Register
        </Button>
      </div>
    </form>
  );
}
