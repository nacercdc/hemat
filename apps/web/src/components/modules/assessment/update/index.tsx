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
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { ASSESSMENT_LIST_KEY } from "../components/table";

export default function UpdateAssessment() {
  const toaster = useToast();
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id;

  const { mutate: updateAssessment, ...updateAssessmentState } = usePutMutation<
    Assessment,
    AssessmentUpdate
  >(`assessments/${assessmentId as string}`);

  const onCancelAssessmentFormHandler = () => {
    router.push("/assessment");
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
            message: "Assessment has been updated successfully",
            variant: "success",
          });
          queryClient.invalidateQueries({
            queryKey: [ASSESSMENT_LIST_KEY],
          });
          router.push("/assessment");
        },
      }
    );
  };

  return (
    <PageContainer pageTitle="New Assessment" includeBreadcrumb={false}>
      <AssessmentForm
        assessmentId={assessmentId as string}
        isLoading={updateAssessmentState.isPending}
        onSubmitAssessmentForm={onSubmitAssessmentFormHandler}
        onCancelAssessmentForm={onCancelAssessmentFormHandler}
      />
    </PageContainer>
  );
}
