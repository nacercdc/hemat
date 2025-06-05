"use client";

import {
  AvatarInput,
  Button,
  InputRHF,
  PhoneNumberInputRHF,
  SelectRHF,
} from "@etm/web-ui-components";
import { Icon } from "@iconify/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Dummy type tobe replaced
interface GenderType {
  id: string;
  name: "Male" | "Female";
}

// Dummy type tobe replaced
interface CountryType {
  id: string;
  name: string;
}

// Dummy interface tobe replaced
const genderOptions: GenderType[] = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
];

// Dummy interface tobe replaced
const countryOptions: CountryType[] = [
  { id: "eth", name: "Ethiopia" },
  { id: "us", name: "USA" },
];

const GenderSchema = z.object({
  id: z.string().min(1, { message: "Gender ID is required" }),
  name: z.string().min(1, { message: "Gender name is required" }),
});

const CountrySchema = z.object({
  id: z.string().min(1, { message: "Country ID is required" }),
  name: z.string().min(1, { message: "Country name is required" }),
});

const ProfileDetailSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().min(1, { message: "Middle name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid Email address" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Mobile phone is required" })
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  gender: GenderSchema,
  country: CountrySchema,
});

export type ProfileDetailFormData = z.infer<typeof ProfileDetailSchema>;

export default function ProfileTab() {
  const { control, handleSubmit } = useForm<ProfileDetailFormData>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    resolver: zodResolver(ProfileDetailSchema),
    mode: "onChange",
  });
  const [profilePic, setProfilePic] = useState<File | undefined>();
  const profilePicRef = useRef<HTMLInputElement>(null);

  const onProfilePicChangeHandler = (file?: File) => {
    setProfilePic(file);
  };

  const onProfileDetailSubmitHandler = (_values: ProfileDetailFormData) => {
    //TODO: implement profile detail submit
  };

  return (
    <form
      onSubmit={handleSubmit(onProfileDetailSubmitHandler)}
      className="flex flex-col gap-9 max-w-6xl"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <AvatarInput
            initialFilePreviewURL=""
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
          <span className="text-lg font-bold">Eniola Wale</span>
          <span className="text-dark-light text-xs">example@gmail.com</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <InputRHF
          name="firstName"
          control={control}
          label="First Name"
          size="lg"
          labelVariant="medium"
          placeholder="Enter first name"
        />
        <InputRHF
          name="middleName"
          control={control}
          label="Middle Name"
          size="lg"
          labelVariant="medium"
          placeholder="Enter middle name"
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
          options={countryOptions}
          placeholder="Select country"
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
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <span className="text-lg font-bold">Contact Email</span>
          <span className="text-xs font-medium text-dark-light">
            Manage your email accounts
          </span>
        </div>
        {/* TODO: this will be replaced by field array later */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-7xl">
          <div className="lg:col-span-2">
            <InputRHF
              leftNode={
                <Icon
                  icon="ic:outline-email"
                  className="ml-2 !text-dark-lighter"
                />
              }
              name="email"
              control={control}
              label="Email"
              size="lg"
              labelVariant="medium"
              placeholder="Enter your email"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" size="lg">
          Cancel
        </Button>
        <Button type="submit" size="lg">
          Update
        </Button>
      </div>
    </form>
  );
}
