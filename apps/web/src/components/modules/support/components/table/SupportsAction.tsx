"use client";

import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import { Dialog, DropdownMenu, useToast } from "@etm/web-ui-components";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";
import type { DialogRef } from "@etm/web-ui-components";
import type { Support } from "~/libs/models/support.model";
import { useRouter } from "next/navigation";

interface Props {
  support: Support;
  refetch?: () => void;
}
export default function SupportAction({ support }: Props) {
  const router = useRouter();

  const deleteSupportDialogRef = useRef<DialogRef>(null);

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate: deleteSupport, ...deleteSupportState } = useDeleteMutation(
    `support/${support.id}`
  );

  const onDeleteSupportHandler = () => {
    deleteSupport(
      {},
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Support has been deleted successfully!",
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["/support"] });
          deleteSupportDialogRef.current?.closeDialog();
        },
      }
    );
  };

  const onViewDetailHandler = () => {
    router.push(`/support/${support.id}`);
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
              <Icon
                icon="lets-icons:view-light"
                className="!text-xl text-dark"
              />
            ),
            onClick: onViewDetailHandler,
          },
          {
            value: "delete",
            label: "Delete",
            leftNode: (
              <Icon
                icon="material-symbols-light:delete-outline"
                className="!text-xl text-dark"
              />
            ),
            onClick: () => {
              deleteSupportDialogRef.current?.openDialog();
            },
          },
        ]}
      />
      <Dialog
        ref={deleteSupportDialogRef}
        actionLabel="Yes"
        onAction={onDeleteSupportHandler}
        autoClosable={false}
        actionLoading={deleteSupportState.isPending}
        title="Delete Support"
      >
        Are you sure you want to delete this support?
      </Dialog>
    </>
  );
}
