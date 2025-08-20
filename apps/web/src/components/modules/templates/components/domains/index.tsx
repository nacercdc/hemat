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
export const DOMAIN_LIST_QUERY_KEY = "domains";
interface Props {
  modalRef: React.RefObject<ModalRef | null>;
}
export function DomainsList({ modalRef }: Props) {
  const { domainId } = useActiveList();
  const { toast } = useToast();

  const { data: domains, ...domainsState } = useFindAll<IDomain>({
    path: "/domains",
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
          description: values.description,
          translations: Object.fromEntries(
            Object.entries(values.translations).map(([key, value]) => [
              key,
              {
                name: value.name ?? "",
                description: value.description ?? "",
              },
            ])
          ),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [DOMAIN_LIST_QUERY_KEY],
          });
          toast({
            title: "Success",
            message: "Domain created successfully",
            variant: "success",
          });

          modalRef.current?.closeModal();
        },
      }
    );
  };
  console.log(domains, "domains");

  return (
    <div className="flex flex-col gap-5 overflow-y-auto h-full">
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
