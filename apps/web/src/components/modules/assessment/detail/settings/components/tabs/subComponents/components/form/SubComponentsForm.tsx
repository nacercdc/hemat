"use client";

import { Button, useToast } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useCallback } from "react";

import { Fields } from "./SubComponentFields";
import type {
  AssessmentSubComponent,
  AssessmentSubComponentUpdate,
} from "~/libs/models/assessment-sub-component.model";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import type { Assessment } from "~/libs/models/assessment.model";
import { DEFAULT_LANGUAGE_CODE } from "~/constants";

export const assessmentSubComponentFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    code: z.string().min(1, { message: "Code is required" }).max(10, {
      message: "Code must be at most 10 characters long",
    }),
    translations: z.record(
      z.string(),
      z
        .object({
          name: z.string().optional(),
          description: z.string().optional(),
          code: z.string().optional(),
        })
        .optional()
    ),
    selectedLanguages: z
      .array(
        z.object({
          name: z.string(),
          code: z.string(),
          native: z.string(),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    data.selectedLanguages?.forEach((lang) => {
      const translation = data.translations[lang.code];

      if (!translation?.name || translation.name.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Name is required for this language",
          path: ["translations", lang.code, "name"],
        });
      }

      if (!translation?.description || translation.description.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Description is required for this language",
          path: ["translations", lang.code, "description"],
        });
      }

      if (!translation?.code || translation.code.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Code is required for this language",
          path: ["translations", lang.code, "code"],
        });
      }
    });
  });

export type AssessmentSubComponentFormData = z.infer<
  typeof assessmentSubComponentFormSchema
>;

interface Props {
  assessment?: Assessment;
  assessmentId: string;
  refetchSubComponents: () => void;
  activeSubComponent: AssessmentSubComponent | null;
}

export const SubComponentForm = ({
  assessment,
  assessmentId,
  activeSubComponent,
  refetchSubComponents,
}: Props) => {
  const { toast } = useToast();
  const assessmentLanguages = (assessment?.languages ?? []).filter(
    (lang) => lang.code !== DEFAULT_LANGUAGE_CODE
  );
  const selectedLanguages = assessmentLanguages;
  const getDefaultTranslations = useCallback(
    (subComponent: AssessmentSubComponent | null) => {
      if (subComponent?.translations) {
        return subComponent.translations;
      }
      const translations: Record<
        string,
        { name: string; description: string; code: string }
      > = {};
      selectedLanguages.forEach((lang) => {
        translations[lang.code] = {
          name: "",
          description: "",
          code: "",
        };
      });
      return translations;
    },
    [selectedLanguages]
  );
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AssessmentSubComponentFormData>({
    defaultValues: {
      name: activeSubComponent?.name ?? "",
      description: activeSubComponent?.description ?? "",
      code: activeSubComponent?.code ?? "",
      selectedLanguages,
      translations: activeSubComponent?.translations ?? {},
    },
    resolver: zodResolver(assessmentSubComponentFormSchema),
    mode: "all",
  });
  const { mutate: updateSubComponent, ...updateSubComponentState } =
    usePutMutation<AssessmentSubComponent, AssessmentSubComponentUpdate>(
      `/assessments/${assessmentId}/sub-components/${activeSubComponent?.id}`
    );

  console.log(errors, "Errr");

  const onSubmitHandler = (values: AssessmentSubComponentFormData) => {
    const filteredTranslations = Object.fromEntries(
      Object.entries(values.translations || {})
        .filter(([key]) => selectedLanguages?.some((lang) => lang.code === key))
        .map(([key, value]) => [
          key,
          {
            name: value?.name || "",
            description: value?.description || "",
            code: value?.code || "",
          },
        ])
    );
    updateSubComponent(
      {
        data: {
          ...values,
          id: activeSubComponent?.id ?? "",
          componentId: activeSubComponent?.componentId ?? "",
          translations: filteredTranslations,
        },
      },
      {
        onSuccess: () => {
          refetchSubComponents();
          toast({
            title: "Component updated successfully",
            message: "The component has been updated successfully.",
            variant: "success",
          });
        },
      }
    );
  };
  const onCancelHandler = useCallback(() => {
    reset({
      name: activeSubComponent?.name ?? "",
      description: activeSubComponent?.description ?? "",
      code: activeSubComponent?.code ?? "",
      translations: getDefaultTranslations(activeSubComponent),
      selectedLanguages,
    });
  }, [activeSubComponent, getDefaultTranslations, reset, selectedLanguages]);

  useEffect(() => {
    reset({
      name: activeSubComponent?.name ?? "",
      description: activeSubComponent?.description ?? "",
      code: activeSubComponent?.code ?? "",
      translations: getDefaultTranslations(activeSubComponent),
      selectedLanguages,
    });
  }, [activeSubComponent, reset, assessment?.languages]);
  if (!activeSubComponent) {
    return null;
  }

  return (
    <form
      id="subComponent-form"
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-6 w-full flex-1 overflow-y-auto p-4"
    >
      <Fields
        control={control}
        selectedLanguages={selectedLanguages}
        watch={watch}
        errors={errors}
      />
      <div className="flex flex-col-reverse min-[400px]:flex-row justify-end gap-4 min-[400px]:gap-8 min-[400px]:items-center items-end ">
        <Button
          variant="outline"
          type="button"
          color="card"
          size="lg"
          onClick={onCancelHandler}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          type="submit"
          form="subComponent-form"
          loading={updateSubComponentState.isPending}
        >
          {updateSubComponentState.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
