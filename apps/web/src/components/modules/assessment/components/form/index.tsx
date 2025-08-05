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
import type { Country } from "~/libs/models/country.model";
import type { Language } from "~/libs/models/language.model";
import type { Assessment } from "~/libs/models/assessment.model";
import { useEffect } from "react";
import { AssessmentFormSkeleton } from "./AssessmentFormSkeleton";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";

const languageSchema = z.object({
  code: z
    .string()
    .min(2, { message: "Language name is too short" })
    .max(50, { message: "Language name is too long" }),
});
const CountrySchema = z.object(
  {
    code: z.string(),
  },
  { required_error: "Country is required" }
);

const AssessmentFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Assessment name must be at least 2 characters" })
      .max(50, { message: "Assessment name must be at most 50 characters" }),
    startDate: z.date(),
    endDate: z.date(),
    country: CountrySchema,
    organization: z
      .string()
      .min(1, { message: "Organization must be at least 1 character" })
      .max(100, {
        message: "Organization name must be at most 100 characters",
      }),
    description: z
      .string()
      .min(1, { message: "Description must be at least 1 character" })
      .max(500, { message: "Description must be at most 500 characters" }),
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
  assessmentId?: string;
  isLoading?: boolean;
  onSubmitAssessmentForm: (values: AssessmentFormData) => void;
  onCancelAssessmentForm?: () => void;
}

export function AssessmentForm({
  isLoading,
  assessmentId,
  onSubmitAssessmentForm,
  onCancelAssessmentForm,
}: Props) {
  const { data: assessment, ...assessmentState } = useFindById<Assessment>({
    path: `assessments/${assessmentId}`,
    tqOptions: {
      enabled: !!assessmentId,
    },
  });

  const { data: languages, ...languagesState } = useFindAll<Language>({
    path: "/languages",
  });
  const { data: countries, ...countriesState } = useFindAll<Country>({
    path: "/countries",
    tqOptions: {
      enabled: !!assessment,
    },
  });

  const { control, handleSubmit, reset } = useForm<AssessmentFormData>({
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      organization: "",
      languages: [],
      description: "",
    },
    resolver: zodResolver(AssessmentFormSchema),
    mode: "all",
  });

  const onSubmitHandler = (values: AssessmentFormData) => {
    onSubmitAssessmentForm({
      ...values,
      startDate: values.startDate,
      endDate: values.endDate,
    });
  };

  const onCancelHandler = () => {
    onCancelAssessmentForm?.();
    reset();
  };

  useEffect(() => {
    if (assessment) {
      reset({
        name: assessment?.name,
        startDate: new Date(assessment.startDate),
        endDate: new Date(assessment.endDate),
        country: assessment?.country?.code
          ? { code: assessment.country.code }
          : undefined,
        organization: assessment?.organization,
        languages: Array.isArray(assessment?.languages)
          ? assessment.languages.map((lang) => ({
              code: lang.code,
              name: lang.name,
            }))
          : [],

        description: assessment?.description,
      });
    }
  }, [assessment, reset]);

  if (assessmentState.isLoading) {
    return <AssessmentFormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
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
          onOpenChange={() => countriesState.refetch()}
          options={(countries?.data as unknown as Country[]) ?? []}
          loading={countriesState.isLoading || countriesState.isFetching}
        />

        <InputRHF
          control={control}
          name="organization"
          label={"Organization"}
          placeholder="Organization Name"
          size="xl"
          labelVariant="bold"
        />
        <MultiSelectRHF
          control={control}
          name="languages"
          placeholder="Select Languages"
          options={(languages?.data as unknown as Language[]) ?? []}
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
