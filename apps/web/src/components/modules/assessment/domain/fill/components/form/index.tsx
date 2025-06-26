"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ETMEditorRHF,
  isHtmlStringEmpty,
  RadioGroupRHF,
  Tooltip,
} from "@etm/web-ui-components";
import { Icon } from "@iconify/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { AssessmentFormSkeleton } from "./AssessmentFormSkeleton";
import type { Scale } from "~/libs/models/scale.model";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Answer, AnswerIncludable } from "~/libs/models/answer.model";

export const SubCompAssessmentFormID = "SubCompAssessmentForm";

//TODO: extract every temp interface to there own model
export interface SubComponent {
  id: string;
  name: string;
  description: string;
}

export interface ScaleDescription {
  id: string;
  description: string;
}

const MeasurementScaleSchema = z.object(
  {
    id: z.string(),
    name: z.string(),
  },
  {
    required_error: "Measurement scale is required",
    invalid_type_error: "Measurement scale type invalid",
  }
);

const AssessmentFormSchema = z.object({
  measurementScale: MeasurementScaleSchema,
  evidence: z.string().superRefine((html, ctx) => {
    if (isHtmlStringEmpty(html)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Evidence can't be empty",
      });
    }
  }),
  reference: z.string().superRefine((html, ctx) => {
    if (isHtmlStringEmpty(html)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Reference can't be empty",
      });
    }
  }),
});

export type AssessmentFormData = z.infer<typeof AssessmentFormSchema>;
export type MeasurementScaleType = z.infer<typeof MeasurementScaleSchema>;

interface Props {
  subComponent?: SubComponent;
  isLoading?: boolean;
  onSubmitHandler: (values: AssessmentFormData) => void;
}

export function SubCompAssessmentForm({
  subComponent,
  isLoading = false,
  onSubmitHandler,
}: Props) {
  const { control, reset, handleSubmit } = useForm<AssessmentFormData>({
    defaultValues: {
      evidence: "",
      reference: "",
    },
    resolver: zodResolver(AssessmentFormSchema),
  });

  const [activeMeasurementScale, setActiveMeasurementScale] =
    useState<MeasurementScaleType>();

  //TODO: replace assessmentId from params
  const { data: measurementScales, ...measurementScalesState } = useFindAll<
    QueryManyResponse<MeasurementScaleType>
  >({
    path: "/assessments/60063a25-b3c0-4273-af1b-4a43dfee2ddf/measurement-scales",
    queries: {
      limit: 100,
      page: 1,
    },
  });

  //TODO: replace assessmentId from params
  const { data: subComponentAnswers, ...subComponentAnswersState } =
    useFindById<QueryManyResponse<Answer>, AnswerIncludable>({
      path: `/assessments/60063a25-b3c0-4273-af1b-4a43dfee2ddf/sub-components/${subComponent?.id}/answers`,
      queries: {
        include: ["measurementScale"],
      },
      tqOptions: {
        enabled: !!subComponent,
      },
    });

  const { data: scaleDescription, ...scaleDescriptionState } = useFindById<
    ScaleDescription,
    unknown
  >({
    path: `/assessment-sub-components/${subComponent?.id}/measurement-scales/${activeMeasurementScale?.id}`,
    tqOptions: {
      enabled: !!activeMeasurementScale,
    },
  });

  const formattedMeasurementScales = useCallback(
    () =>
      (measurementScales?.data as unknown as Scale[])?.map((scale) => ({
        ...scale,
        name: `${scale.name} (${scale.rate})`,
      })),
    [measurementScales?.data]
  );

  const scaleDescriptionLoading =
    scaleDescriptionState.isFetching || scaleDescriptionState.isLoading;

  const onScaleDescHoverHandler = (scaleData: MeasurementScaleType) => {
    if (!scaleDescriptionLoading) setActiveMeasurementScale(scaleData);
  };

  const onScaleDescMouseLeaveHandler = () => {
    setActiveMeasurementScale(undefined);
  };

  //TODO: it will be an object response instead of an array onces the API is fixed
  useEffect(() => {
    const answers = subComponentAnswers?.data as unknown as Answer[];
    if (answers?.length) {
      const answer = answers.find(
        (ans) => ans.subComponentId === subComponent?.id
      );
      if (answer) {
        const formattedScale = formattedMeasurementScales().find(
          (scale) => scale.id === answer.measurementScale.id
        );
        reset({
          evidence: answer.evidence,
          reference: answer.reference,
          measurementScale: {
            id: formattedScale?.id,
            name: formattedScale?.name,
          },
        });
      }
    } else {
      reset({
        evidence: "",
        reference: "",
        measurementScale: { id: "" },
      });
    }
  }, [
    formattedMeasurementScales,
    reset,
    subComponent?.id,
    subComponentAnswers?.data,
  ]);

  if (
    isLoading ||
    measurementScalesState.isFetching ||
    subComponentAnswersState.isFetching
  )
    return <AssessmentFormSkeleton />;

  return (
    <form
      key={subComponent?.id}
      id={`${SubCompAssessmentFormID}`}
      onSubmit={handleSubmit(onSubmitHandler)}
      className="w-full transition-all duration-1000 ease-in-out"
    >
      <div className="flex flex-col w-full h-full p-7 gap-6 border border-basic-300 rounded-lg">
        <span className="text-lg font-bold">{subComponent?.name}</span>

        <p className="text-xs font-medium text-dark-light">
          {subComponent?.description}
        </p>

        <RadioGroupRHF<MeasurementScaleType, AssessmentFormData>
          control={control}
          name="measurementScale"
          options={formattedMeasurementScales()}
          valueKey="id"
          labelKey="name"
          size="sm"
          alignment="grid"
          badge={
            <Tooltip
              trigger={
                <Icon
                  icon="heroicons:information-circle"
                  className="!w-4 !h-4"
                />
              }
              content={scaleDescription?.description}
              contentLoading={scaleDescriptionLoading}
              color="dark"
            />
          }
          onBadgeHover={onScaleDescHoverHandler}
          onBadgeLeave={onScaleDescMouseLeaveHandler}
        />

        <ETMEditorRHF
          control={control}
          name="evidence"
          label="Evidence"
          labelVariant="medium"
          placeholder="Write you evidence here"
        />

        <ETMEditorRHF
          control={control}
          name="reference"
          label="Reference"
          labelVariant="medium"
          placeholder="Write you reference here"
        />
      </div>
    </form>
  );
}
