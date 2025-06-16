"use client";

import { useRouter } from "next/navigation";

import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { Assessment, AssessmentCreate } from "~/libs/models/assessment.model";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { useToast } from "@etm/web-ui-components";
import { AssessmentForm, AssessmentFormData } from "../components/form";

export default function CreateAssessment() {
  const router = useRouter();
  const toaster = useToast();
  const { mutate: createAssessment, ...createAssessmentState } = useAddMutation<
    Assessment,
    AssessmentCreate
  >("/assessments");

  const onSubmitAssessmentFormHandler = (data: AssessmentFormData) => {
    createAssessment(
      {
        data: {
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
            message: "Assessment created successfully",
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
        isLoading={createAssessmentState.isPending}
        onSubmitAssessmentForm={onSubmitAssessmentFormHandler}
        onCancelAssessmentForm={() => {}}
      />
    </PageContainer>
  );
}
