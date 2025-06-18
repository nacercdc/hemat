"use client";

import { useParams, useRouter } from "next/navigation";
import type {
  Assessment,
  AssessmentUpdate,
} from "~/libs/models/assessment.model";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { useToast } from "@etm/web-ui-components";
import type { AssessmentFormData } from "../components/form";
import { AssessmentForm } from "../components/form";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";

export default function UpdateAssessment() {
  const toaster = useToast();
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id;
  const { data: assessment, ...assessmentState } = useFindById<Assessment>({
    path: `assessments/${assessmentId}`,
  });
  const { mutate: updateAssessment, ...updateAssessmentState } = usePutMutation<
    Assessment,
    AssessmentUpdate
  >(`assessments/${assessmentId}`);

  const onCancelAssessmentFormHandler = () => {
    router.push("/assessment?refresh=true");
  };
  const onSubmitAssessmentFormHandler = (data: AssessmentFormData) => {
    updateAssessment(
      {
        data: {
          id: assessmentId as string,
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          countryCode: data.country.code ?? "",
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
            message: "Assessment Updated successfully",
            variant: "success",
          });
          router.push("/assessment?refresh=true");
        },
      }
    );
  };

  return (
    <PageContainer pageTitle="New Assessment" includeBreadcrumb={false}>
      <AssessmentForm
        assessment={assessment}
        isLoading={updateAssessmentState.isPending}
        onSubmitAssessmentForm={onSubmitAssessmentFormHandler}
        onCancelAssessmentForm={onCancelAssessmentFormHandler}
      />
    </PageContainer>
  );
}
