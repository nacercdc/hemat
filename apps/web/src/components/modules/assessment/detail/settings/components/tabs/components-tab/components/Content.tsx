/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button, useToast } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useCallback } from "react";

import { Fields } from "./Fields";
import type {
  AssessmentComponent,
  AssessmentComponentUpdate,
} from "~/libs/models/assessment-component.model";
import { DEFAULT_LANGUAGE_CODE } from "~/constants";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import type { Assessment } from "~/libs/models/assessment.model";

export const assessmentComponentFormSchema = z
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
      .min(1, { message: "At least one language is required" }),
  })
  .superRefine((data, ctx) => {
    data.selectedLanguages.forEach((lang) => {
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

export type AssessmentComponentFormData = z.infer<
  typeof assessmentComponentFormSchema
>;

interface Props {
  assessment?: Assessment;
  assessmentId: string;
  refetchComponents: () => void;
  activeComponent: AssessmentComponent | null;
}

export function Content({
  activeComponent,
  assessment,
  assessmentId,
  refetchComponents,
}: Props) {
  const { toast } = useToast();

  const nonDefaultLanguages = (assessment?.languages ?? []).filter(
    (lang) => lang.code !== DEFAULT_LANGUAGE_CODE
  );

  const getDefaultTranslations = useCallback(
    (component: AssessmentComponent | null) => {
      if (component?.translations) {
        return component.translations;
      }
      const translations: Record<
        string,
        { name: string; description: string; code: string }
      > = {};
      nonDefaultLanguages.forEach((lang) => {
        translations[lang.code] = {
          name: "",
          description: "",
          code: "",
        };
      });
      return translations;
    },
    [nonDefaultLanguages]
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AssessmentComponentFormData>({
    defaultValues: {
      name: activeComponent?.name ?? "",
      description: activeComponent?.description ?? "",
      code: activeComponent?.code ?? "",
      selectedLanguages: nonDefaultLanguages,
      translations: activeComponent?.translations ?? {},
    },
    resolver: zodResolver(assessmentComponentFormSchema),
    mode: "all",
  });

  const selectedLanguages = nonDefaultLanguages;

  const { mutate: updateComponent, ...updateComponentState } = usePutMutation<
    AssessmentComponent,
    AssessmentComponentUpdate
  >(`/assessments/${assessmentId}/components/${activeComponent?.id}`);

  const onSubmitHandler = (values: AssessmentComponentFormData) => {
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

    updateComponent(
      {
        data: {
          id: activeComponent?.id ?? "",
          code: values.code,
          name: values.name,
          description: values.description,
          translations: filteredTranslations,
        },
        isProtected: true,
      },
      {
        onSuccess: () => {
          refetchComponents();
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
      name: activeComponent?.name ?? "",
      description: activeComponent?.description ?? "",
      code: activeComponent?.code ?? "",
      translations: getDefaultTranslations(activeComponent),
      selectedLanguages: nonDefaultLanguages,
    });
  }, [activeComponent, getDefaultTranslations, nonDefaultLanguages, reset]);

  useEffect(() => {
    reset({
      name: activeComponent?.name ?? "",
      description: activeComponent?.description ?? "",
      code: activeComponent?.code ?? "",
      translations: getDefaultTranslations(activeComponent),
      selectedLanguages: nonDefaultLanguages,
    });
  }, [activeComponent, reset]);

  if (!activeComponent) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col w-full md:w-3/4 h-full bg-card border border-secondary-300 rounded-r-sm gap-6 flex-1 overflow-y-auto pb-20 p-4"
    >
      <>
        <Fields
          control={control}
          selectedLanguages={selectedLanguages}
          watch={watch}
          errors={errors}
        />
      </>

      <div className="flex justify-end gap-8 items-center w-full bg-basic-200/30 p-4">
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
          loading={updateComponentState.isPending}
        >
          {updateComponentState.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
