"use client";

import {
  Button,
  DateTimePickerRHF,
  Input,
  SelectRHF,
  TextArea,
} from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { africanCountries } from "~/config/country.config";
import { africanLanguages } from "~/config/language.config";
interface Country {
  code: string;
  name: string;
}
interface Language {
  code: string;
  name: string;
}
interface Assessment {
  id?: string;
  name: string;
  createdBy: string;
  startDate: Date;
  endDate: Date;
  country: Country;
  organization: string;
  description?: string | null;
  language: Language;
}
const languageSchema = z.object({
  code: z.string()
    .min(2, { message: "Language code must be at least 2 characters" })
    .max(10, { message: "Language code must be at most 10 characters" })
    .regex(/^[a-z]{2,10}$/i, { message: "Language code must contain only letters" }),
  name: z.string()
    .min(2, { message: "Language name is too short" })
    .max(50, { message: "Language name is too long" }),
});

const countrySchema = z.object({
  code: z.string()
    .min(2, { message: "Country code must be at least 2 characters" })
    .max(3, { message: "Country code must be at most 3 characters" })
    .regex(/^[A-Z]{2,3}$/, { message: "Country code must be uppercase letters only (e.g., 'US', 'ETH')" }),
  name: z.string()
    .min(2, { message: "Country name is too short" })
    .max(100, { message: "Country name is too long" }),
});

const AssessmentFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Assessment name must be at least 2 characters" })
    .max(50, { message: "Assessment name must be at most 50 characters" }),
  createdBy: z.string()
    .uuid({ message: "CreatedBy must be a valid Vuser" }),
  startDate: z.date(),
  endDate: z.date(),
  country: countrySchema,
  organization: z.string()
    .min(2, { message: "Organization name is required" })
    .max(100, { message: "Organization name must be at most 100 characters" }),

  description: z.string()
    .max(500, { message: "Description must be at most 500 characters" }).optional(),
  language: languageSchema,
}).refine(data => data.endDate > data.startDate, {
  path: ['endDate'],
  message: "End date must be after start date",
});;
type AssessmentForm = z.infer<typeof AssessmentFormSchema>;

export function AssessmentsCreate() {

  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<AssessmentForm>({
    resolver: zodResolver(AssessmentFormSchema),
    defaultValues: {
      name: "",
      createdBy: "",
      startDate: new Date(),
      endDate: new Date(),
      country: { code: "", name: "" },
      organization: "",
      language: { code: "", name: "" },
      description: "",
    },
  });
  const loading = false
  const onSubmit: SubmitHandler<Assessment> = (data) => {
    console.log(data)
    // TODO 
  }

  if (loading) {
    return <div>Loading...</div>; // TODO replace this with a proper skeleton component if available
  }
  return (
    <PageContainer>
      <div className="font-bold  bg-white shadow-md  flex items-start gap-8 -mx-4 -mt-4 pl-4 justify-start">
        <span className="p-2 bg-layout-bg rounded-full cursor-pointer">
          <button className="flex items-center" onClick={() => {
            router.push("/assessment");
          }}>
            <Icon
              icon="mdi:chevron-left"
              role="button"
              className={`text-2xl  rounded-full font-bold  text-secondary cursor-pointer`}
            />
          </button>
        </span>
        <h1 className="text-lg flex items-center p-2">Create New Assessment</h1>
      </div>
      <div className="flex flex-col w-96 md:w-[744px]  rounded-xl  overflow-y-auto  mx-auto bg-layout-bg">
        <form
          className="flex flex-col gap-6 px-8 pt-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            name="name"
            label="Assessment Name"
            placeholder="Write Name"
            size="xl"
            labelVariant="bold"
          />

          <Input
            name="createdBy"
            label={"Created by Name"}
            placeholder="Created by Name"
            size="xl"
            labelVariant="bold"
          />

          <div className="xl:col-start-2 col-start-1 flex gap-2">
            <DateTimePickerRHF
              control={control}
              name="startDate"
              label="Start Date"
              labelVariant="bold"
              size="xl"
              showTime={false}
              iconDirection="right"
              placeholder="Select start date"
            />
            <DateTimePickerRHF
              control={control}
              name="endDate"
              label="End Date"
              size="xl"
              showTime={false}
              iconDirection="right"
              placeholder="Select end date"
              labelVariant="bold"
            />
          </div>
          <SelectRHF<Country, AssessmentForm>
            control={control}
            name="country.code"
            labelKey="name"
            valueKey="code"
            displayLabel="Country"
            labelVariant="bold"
            size="xl"
            options={africanCountries}
          />
          <Input
            name="organization"
            label={"Organization(Optional)"}
            placeholder="Organization Name"
            size="xl"
            labelVariant="bold"
          />

          <SelectRHF<Language, AssessmentForm>
            control={control}
            name="language"
            labelKey="name"
            valueKey="code"
            displayLabel="Language"
            labelVariant="bold"
            size="xl"
            options={africanLanguages}
          />

          <TextArea
            name="description"
            label={"Description"}
            placeholder="Write Description..."
            labelVariant="bold"
            rows={4}
          />
        </form>
        <div className="flex justify-between items-center w-full bg-layout-bg p-4 rounded-b-lg px-8">
          <Button variant="outline" color="lightGray">
            Cancel
          </Button>
          <Button size="lg">Save</Button>
        </div>
      </div>
    </PageContainer>
  );
}
