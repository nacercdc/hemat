"use client";
import {
  Button,
  DateTimePickerRHF,
  InputRHF,
  MultiSelectRHF,
  SelectRHF,
  TextAreaRHF,
} from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Country } from "~/libs/models/country.model";
import type { Language } from "~/libs/models/language.model";
import type { Assessment } from "~/libs/models/assessment.model";
import { useEffect } from "react";
import { safeDate } from "~/utils/date.util";
import { AssessmentFormSkeleton } from "./AssessmentFormSkeleton";
const languageSchema = z.object({
  code: z
    .string()
    .min(2, { message: "Language name is too short" })
    .max(50, { message: "Language name is too long" }),
});
const countrySchema = z.object({
  code: z
    .string()
    .min(2, { message: "Country name is too short" })
    .max(50, { message: "Country name is too long" }),
});
const AssessmentFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Assessment name must be at least 2 characters" })
      .max(50, { message: "Assessment name must be at most 50 characters" }),
    startDate: z.date(),
    endDate: z.date(),
    country: countrySchema,
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
export type AssessmentFormData = z.infer<typeof AssessmentFormSchema>;

interface Props {
  onSubmitAssessmentForm: (values: AssessmentFormData) => void;
  onCancelAssessmentForm?: () => void;
  isLoading?: boolean;
  assessment?: Assessment;
}

export function AssessmentForm({
  onSubmitAssessmentForm,
  onCancelAssessmentForm,
  isLoading = false,
  assessment,
}: Props) {
  const { control, handleSubmit, reset } = useForm<AssessmentFormData>({
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      country: {},
      organization: "",
      languages: [],
      description: "",
    },
    resolver: zodResolver(AssessmentFormSchema),
    mode: "all",
  });

  const onCancelHandler = () => {
    onCancelAssessmentForm?.();
    reset();
  };
  const { data: languages, ...languagesState } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });
  const { data: country, ...countriesState } = useFindAll<
    QueryManyResponse<Country>
  >({
    path: "/countries",
  });
  const languageOptions: Language[] =
    (languages?.data as unknown as Language[]) ?? [];
  const countryOptions: Country[] =
    (country?.data as unknown as Country[]) ?? [];

  useEffect(() => {
    if (!assessment) return;
    console.log("Raw:", assessment.startDate);
    console.log("Parsed:", safeDate(assessment.startDate));
    reset({
      name: assessment?.name,
      startDate: safeDate(assessment.startDate),
      endDate: safeDate(assessment.endDate),
      country: {
        code: assessment?.countryCode,
      },
      organization: assessment?.organization,
      languages: Array.isArray(assessment?.languages)
        ? assessment.languages.map((lang) => ({ code: lang.code }))
        : [],
      description: assessment?.description,
    });
  }, [assessment, reset]);
  if (!assessment) {
    return <AssessmentFormSkeleton />;
  }
  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmitAssessmentForm(values);
        reset();
      })}
      className="flex flex-col  md:w-[744px]  rounded-md   mx-auto bg-dark-lighter/5"
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
          name="country"
          labelKey="name"
          valueKey="code"
          displayLabel="Country"
          labelVariant="bold"
          size="xl"
          options={countryOptions}
          loading={countriesState.isLoading}
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
        <Button variant="outline" color="lightGray" onClick={onCancelHandler}>
          Cancel
        </Button>
        <Button type="submit" size="lg" loading={isLoading}>
          {assessment ? "Edit" : "Save"}
        </Button>
      </div>
    </form>
  );
}
