import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Dialog, DropdownMenu, useToast } from "@etm/web-ui-components";

import type { DialogRef } from "@etm/web-ui-components";
import type { Assessment } from "~/libs/models/assessment.model";
import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";

interface Props {
  assessment: Assessment;
  onRefetch?: () => void;
}
export default function AssessmentAction({ assessment, onRefetch }: Props) {
  const deleteDialogRef = useRef<DialogRef>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: deleteAssessment, ...deleteAssessmentState } =
    useDeleteMutation<Assessment>(`assessments/${assessment.id}`);
  const onGotoUpdateAssessmentHandler = () => {
    router.push(`/assessment/${assessment.id}/update`);
  };
  const onGotoDetailAssessmentHandler = () => {
    router.push(`/assessment/${assessment.id}/detail`);
  };
  const onDeleteAssessmentHandler = () => {
    deleteAssessment(
      {},
      {
        onSuccess: () => {
          deleteDialogRef.current?.closeDialog();
          onRefetch?.();
          toast({
            title: "Success",
            message: "Assessment has been deleted successfully.",
          });
        },
      }
    );
  };

  return (
    <>
      <DropdownMenu
        triggerTextAlign="end"
        align="end"
        trigger={
          <Icon
            icon="mi:options-horizontal"
            className="text-xl text-right text-dark"
          />
        }
        options={[
          {
            value: "view",
            label: "View",
            leftNode: (
              <Icon icon="solar:eye-outline" className="text-lg text-dark" />
            ),
            onClick: onGotoDetailAssessmentHandler,
          },
          {
            value: "edit",
            label: "Edit",
            leftNode: (
              <Icon icon="iconamoon:edit-light" className="text-lg text-dark" />
            ),
            onClick: onGotoUpdateAssessmentHandler,
          },
          {
            value: "delete",
            label: "Delete",
            leftNode: (
              <Icon
                icon="material-symbols-light:delete-outline"
                className="text-lg text-dark"
              />
            ),
            onClick: () => deleteDialogRef.current?.openDialog(),
          },
        ]}
      />
      <Dialog
        ref={deleteDialogRef}
        title="Delete Assessment"
        actionLabel="Delete"
        actionVariant="destructive"
        onAction={onDeleteAssessmentHandler}
        autoClosable={deleteAssessmentState.isSuccess}
        actionLoading={deleteAssessmentState.isPending}
      >
        Are you sure you want to delete this assessment? This action cannot be
        undone.
      </Dialog>
    </>
  );
}
