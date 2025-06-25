"use client";

import React from "react";

import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { DomainsSkeleton } from "./DomainsSkeleton";
import type {
  Domain as IDomain,
  DomainCreate,
} from "~/libs/models/domain.model";
import { DomainsEmptyPlaceHolder } from "./DomainsEmptyPlaceHolder";
import { useActiveList } from "../../providers/active-list/useActiveList";
import type { ModalRef } from "@etm/web-ui-components";
import { Modal, useToast } from "@etm/web-ui-components";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { Domain } from "./domain";
import type { ItemFormData } from "../form";
import { DomainComponentForm } from "../form";
import { ListTypeColors } from "../DomainCompCard";

interface Props {
  modalRef: React.RefObject<ModalRef | null>;
}
export function Domains({ modalRef }: Props) {
  const { domainId } = useActiveList();
  const { toast } = useToast();

  const { data: domains, ...domainsState } = useFindAll<IDomain>({
    path: "/domains",
    tqOptions: {
      queryKey: ["domains"],
    },
  });

  const { mutate: createDomain, ...createDomainState } = useAddMutation<
    IDomain,
    DomainCreate
  >("domains");

  const onAddItemSubmitHandler = (values: ItemFormData) => {
    createDomain(
      {
        data: {
          name: values.name,
          code: values.code,
          description: values.description,
          translations: values.translations,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Domain created successfully",
            variant: "success",
          });
          queryClient.invalidateQueries({
            queryKey: ["domains"],
          });
          modalRef.current?.closeModal();
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-5 overflow-y-auto">
      {domainsState.isLoading && <DomainsSkeleton />}
      {domainsState.isSuccess && domains?.total && domains?.total > 0 ? (
        <>
          {domains?.data?.map((domain) => (
            <div
              key={domain.id}
              className="rounded-lg"
              style={{
                backgroundColor:
                  domainId === domain.id ? `${ListTypeColors.Component}` : "",
              }}
            >
              <Domain domain={domain} />
            </div>
          ))}
        </>
      ) : (
        !domainsState.isLoading && <DomainsEmptyPlaceHolder />
      )}
      <Modal ref={modalRef} title={`Add Domain`}>
        <DomainComponentForm
          onSubmitHandler={onAddItemSubmitHandler}
          onCloseModal={() => modalRef.current?.closeModal()}
          loading={createDomainState.isPending}
        />
      </Modal>
    </div>
  );
}
