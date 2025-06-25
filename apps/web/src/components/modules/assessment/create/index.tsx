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
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { ASSESSMENT_LIST_KEY } from "../components/table";
import { formatDateToYYYYMMDD } from "@etm/utilities";

export default function CreateAssessment() {
  const router = useRouter();
  const toaster = useToast();
  const { mutate: createAssessment, ...createAssessmentState } = useAddMutation<
    Assessment,
    AssessmentCreate
  >("/assessments");

  const onCancelAssessmentFormHandler = () => {
    router.push("/assessment");
  };

  const onSubmitAssessmentFormHandler = (data: AssessmentFormData) => {
    createAssessment(
      {
        data: {
          name: data.name,
          startDate: formatDateToYYYYMMDD(data.startDate),
          endDate: formatDateToYYYYMMDD(data.endDate),
          countryCode: data.country.code,
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
            message: "Assessment has been created successfully.",
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
        isLoading={createAssessmentState.isPending}
        onSubmitAssessmentForm={onSubmitAssessmentFormHandler}
        onCancelAssessmentForm={onCancelAssessmentFormHandler}
      />
    </PageContainer>
  );
}
