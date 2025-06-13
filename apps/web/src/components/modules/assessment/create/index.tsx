"use client";

import {
  Button,
  DateTimePickerRHF,
  InputRHF,
  MultiSelectRHF,
  SelectRHF,
  TextAreaRHF,
  useToast,
} from "@etm/web-ui-components";

import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { zodResolver } from "@hookform/resolvers/zod";
import { africanCountries } from "~/config/country.config";
import { Assessment, AssessmentCreate } from "~/libs/models/assessment.model";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { useRouter } from "next/navigation";
interface Country {
  code: string;
  name: string;
}
interface Language {
  code: string;
  name: string;
}
const languageSchema = z.object({
  code: z
    .string()
    .min(2, { message: "Language name is too short" })
    .max(50, { message: "Language name is too long" }),
});

const AssessmentFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Assessment name must be at least 2 characters" })
      .max(50, { message: "Assessment name must be at most 50 characters" }),
    startDate: z.date(),
    endDate: z.date(),
    countryCode: z
      .string()
      .min(2, { message: "Country code must be at least 2 characters" })
      .max(3, { message: "Country code must be at most 3 characters" }),
    organization: z
      .string()
      .min(2, { message: "Organization name is required" })
      .max(100, {
        message: "Organization name must be at most 100 characters",
      }),

    description: z
      .string()
      .max(500, { message: "Description must be at most 500 characters" })
      .optional(),
    languages: z
      .array(languageSchema)
      .min(1, { message: "Please select at least one language" }),
  })
  .refine((data) => data.endDate > data.startDate, {
    path: ["endDate"],
    message: "End date must be after start date",
  });

type AssessmentFormData = z.infer<typeof AssessmentFormSchema>;

export function AssessmentsCreate() {
  const router = useRouter();
  const toaster = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(AssessmentFormSchema),
    defaultValues: {
      name: "",
      countryCode: "",
      organization: "",
      languages: [],
      description: "",
    },
    mode: "all",
  });
  const loading = false;
  const onSubmitHandler: SubmitHandler<AssessmentFormData> = (data) => {
    console.log("Form data to submit:", data);

    createAssessment(
      {
        data: {
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          countryCode: data.countryCode,
          organization: data.organization,
          description: data.description,
          languages: data.languages.map((language) => language.code),
        },
        isProtected: true,
      },
      {
        onSuccess: () => {
          toaster.toast({
            title: "Success",
            message: "Assessment created successfully",
            variant: "success",
          });
          router.push("/assessments?refresh=true");
        },
      }
    );
  };
  const { data: languages, ...languagesState } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });
  const { data: country, ...countriesState } = useFindAll<
    QueryManyResponse<Country>
  >({
    path: "/country",
  });

  const languageOptions: Language[] =
    (languages?.data as unknown as Language[]) ?? [];
  const countryOptions: Country[] =
    (country?.data as unknown as Country[]) ?? [];

  const { mutate: createAssessment, ...createAssessmentState } = useAddMutation<
    Assessment,
    AssessmentCreate
  >("/assessments");
  if (loading) {
    return <div>Loading...</div>; // TODO replace this with a proper skeleton component if available
  }
  return (
    <PageContainer pageTitle="New Assessment" includeBreadcrumb={false}>
      <form
        className="flex flex-col  md:w-[744px]  rounded-md   mx-auto bg-dark-lighter/5"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className="flex flex-col gap-6 px-8 pt-8">
          <InputRHF
            name="name"
            label="Assessment Name"
            placeholder="Write Name"
            size="xl"
            labelVariant="bold"
            control={control}
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
          <SelectRHF<Country, AssessmentFormData>
            control={control}
            name="countryCode"
            labelKey="name"
            valueKey="code"
            displayLabel="Country"
            labelVariant="bold"
            size="xl"
            options={countryOptions}
          />
          <InputRHF
            control={control}
            name="organization"
            label={"Organization(Optional)"}
            placeholder="Organization Name"
            size="xl"
            labelVariant="bold"
          />

          <MultiSelectRHF
            control={control}
            name="languages"
            placeholder="Select Languages"
            options={languageOptions}
            valueKey="code"
            labelKey="name"
            displayLabel="Languages"
            labelVariant="bold"
            size="lg"
            loading={languagesState.isLoading}
          />
          <TextAreaRHF
            control={control}
            name="description"
            label={"Description"}
            placeholder="Write Description..."
            labelVariant="bold"
            rows={4}
          />
        </div>
        <div className="flex justify-between items-center w-full bg-dark-lighter/5 p-4 rounded-b-lg px-8">
          <Button variant="outline" color="lightGray">
            Cancel
          </Button>
          <Button type="submit" size="lg" loading={loading}>
            Save
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
