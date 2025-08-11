/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  AvatarInput,
  Button,
  InputRHF,
  PhoneNumberInputRHF,
  SelectRHF,
  useToast,
} from "@etm/web-ui-components";
import { Icon } from "@iconify/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CountryCode } from "libphonenumber-js";
import { isValidPhoneNumber } from "libphonenumber-js";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useGetMe } from "~/providers/me/useGetMe";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import type { Profile, UpdateProfile } from "~/libs/models/profile.model";
import { ProfileTabSkeleton } from "./ProfileTabSkeleton";
import type { Country } from "~/libs/models/country.model";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
export const PERSONAL_TITLES = [
  "Mr.",
  "Mrs.",
  "Miss",
  "Ms.",
  "Mx.",
  "Dr.",
  "Prof.",
  "Eng.",
  "Arch.",
  "Adv.",
  "CPA",
  "Esq.",
];

interface GenderType {
  id: string;
  name: "Male" | "Female";
}

const genderOptions: GenderType[] = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
];

const titleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const GenderSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const CountrySchema = z.object({
  id: z.string(),
  name: z.string(),
});

const ProfileDetailSchema = z.object({
  title: titleSchema.optional(),
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
  userName: z.string().min(1, { message: "User name is required" }),
  phoneNumber: z
    .string()
    .optional()
    .refine((val: string | undefined) => !val || isValidPhoneNumber(val), {
      message: "Invalid phone number",
    }),
  gender: GenderSchema.optional(),
  country: CountrySchema.optional(),
  jobTitle: z.string().min(1, { message: "Job title is required" }),
  profession: z.string().min(1, { message: "Profession is required" }),
  email: z.string().optional(),
});

export type ProfileDetailFormData = z.infer<typeof ProfileDetailSchema>;

export default function ProfileTab() {
  const [profilePic, setProfilePic] = useState<File | undefined>();
  const profilePicRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: currentUser, ...currentUserState } = useGetMe();
  const { data: countries, ...countriesState } = useFindAll<Country>({
    path: "/countries",
  });

  const { mutate: updateProfile, ...updateProfileState } = usePutMutation<
    Profile,
    UpdateProfile
  >(`/profiles`);

  const { mutate: updateProfilePic, ...updateProfilePicState } = useAddMutation<
    Profile,
    FormData
  >(`/profiles/profile-picture`);

  const { control, handleSubmit, reset } = useForm<ProfileDetailFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      jobTitle: "",
      profession: "",
    },
    resolver: zodResolver(ProfileDetailSchema),
    mode: "onChange",
  });

  const onProfilePicChangeHandler = (file?: File) => {
    setProfilePic(file);
  };

  const onProfileDetailSubmitHandler = (values: ProfileDetailFormData) => {
    const updatedProfile: UpdateProfile = {
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.userName,
      country: values.country?.id,
      title: values?.title?.id,
      jobTitle: values.jobTitle,
      gender: values.gender?.id,
      phoneNumber: values?.phoneNumber,
      profession: values.profession,
    };

    updateProfile(
      {
        data: updatedProfile,
      },
      {
        onSuccess: () => {
          currentUserState.refetch();
          toast({
            title: "Success",
            message: "You profile has been updated successfully.",
            variant: "success",
          });
        },
      }
    );
  };

  const onProfilePicSubmitHandler = () => {
    const formData = new FormData();
    if (!profilePic) return;
    formData.append("file", profilePic);

    updateProfilePic(
      {
        data: formData,
        multipart: true,
      },
      {
        onSuccess: () => {
          currentUserState.refetch();
          toast({
            title: "Success",
            message: "You profile picture has been updated successfully.",
            variant: "success",
          });
        },
      }
    );
  };

  useEffect(() => {
    if (currentUserState.isSuccess && currentUser) {
      reset({
        email: currentUser.email,
        title: currentUser.profile?.title
          ? {
              id: currentUser.profile.title,
              name: currentUser.profile.title,
            }
          : undefined,
        jobTitle: currentUser.profile?.jobTitle ?? "",
        profession: currentUser.profile?.profession ?? "",
        firstName: currentUser.profile?.firstName ?? "",
        lastName: currentUser.profile?.lastName ?? "",
        userName: currentUser.profile?.username ?? "",
        country: currentUser.profile.country
          ? {
              id: currentUser.profile.country,
              name: currentUser.profile.country,
            }
          : undefined,
        gender: currentUser.profile?.gender
          ? {
              id: currentUser.profile.gender,
              name: currentUser.profile.gender,
            }
          : undefined,

        phoneNumber: currentUser.profile?.phoneNumber ?? "",
      });
    }
  }, [currentUserState.isSuccess, currentUserState.isRefetching, currentUser]);

  if (currentUserState.isLoading && currentUserState.isFetching) {
    return <ProfileTabSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit(onProfileDetailSubmitHandler)}
      className="flex flex-col gap-9 max-w-6xl"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <AvatarInput
            initialFilePreviewURL={currentUser?.profile.url}
            onChange={onProfilePicChangeHandler}
            file={profilePic}
            ref={profilePicRef}
          />
          <div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[88px] h-[44px] bg-primary/70 rounded-t-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary/60"
            onClick={() => profilePicRef.current?.click()}
          >
            <Icon icon="uil:image" className="!text-white !w-4 !h-4" />
            <span className="text-xs text-white">Change</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold">{currentUser?.name}</span>
          <span className="text-dark-light text-xs">{currentUser?.email}</span>
        </div>
        <Button
          type="button"
          onClick={onProfilePicSubmitHandler}
          disabled={!profilePic}
          loading={updateProfilePicState.isPending}
        >
          Change
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
          name="firstName"
          control={control}
          label="First Name"
          size="lg"
          labelVariant="medium"
          placeholder="Enter first name"
        />

        <InputRHF
          name="lastName"
          control={control}
          label="Last Name"
          size="lg"
          labelVariant="medium"
          placeholder="Enter last name"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
          label="Phone Number"
          labelSize="sm"
          labelVariant="medium"
          size="lg"
          placeholder="Enter your phone number"
          options={(countries?.data ?? []).map((country) => ({
            label: country.name ?? "",
            value: country.code as CountryCode,
          }))}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-7xl">
        <InputRHF
          name="userName"
          control={control}
          label="User Name"
          size="lg"
          labelVariant="medium"
          placeholder="Enter user name"
        />
        <InputRHF
          name="jobTitle"
          control={control}
          label="Job title"
          size="lg"
          labelVariant="medium"
          placeholder="Enter job title"
        />
        <InputRHF
          name="profession"
          control={control}
          label="Profession"
          size="lg"
          labelVariant="medium"
          placeholder="Enter profession"
        />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <span className="text-lg font-bold">Contact Email</span>
          <span className="text-xs font-medium text-dark-light">
            Manage your email accounts
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-7xl">
          <div className="lg:col-span-2">
            <InputRHF
              control={control}
              leftNode={
                <Icon
                  icon="ic:outline-email"
                  className="ml-2 !text-dark-lighter"
                />
              }
              name="email"
              value={currentUser?.email}
              label="Email"
              size="lg"
              labelVariant="medium"
              placeholder="Enter your email"
              disabled
            />
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button type="submit" size="lg" loading={updateProfileState.isPending}>
          Update
        </Button>
      </div>
    </form>
  );
}
