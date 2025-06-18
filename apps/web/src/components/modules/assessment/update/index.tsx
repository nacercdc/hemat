"use client";

import { useRouter } from "next/navigation";

import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import type {
  Assessment,
  AssessmentCreate,
} from "~/libs/models/assessment.model";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { useToast } from "@etm/web-ui-components";
import type { AssessmentFormData } from "../components/form";
import { AssessmentForm } from "../components/form";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";

export default function UpdateAssessment() {
  const router = useRouter();
  const toaster = useToast();

  const { mutate: createAssessment, ...createAssessmentState } = useAddMutation<
    Assessment,
    AssessmentCreate
  >("/assessments");

  const { mutate: updateAssessment, ...updateAssessmentState } = usePutMutation<
    Assessment,
    AssessmentCreate
  >(`measurement-scales/${scale.id}`);

  const onCancelAssessmentFormHandler = () => {
    router.push("/assessment?refresh=true");
  };
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
        assessment={asssessment}
        isLoading={createAssessmentState.isPending}
        onSubmitAssessmentForm={onSubmitAssessmentFormHandler}
        onCancelAssessmentForm={onCancelAssessmentFormHandler}
      />
    </PageContainer>
  );
}
