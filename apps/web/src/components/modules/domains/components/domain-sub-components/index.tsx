"use client";

import React, { useState } from "react";

import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";

import { useActiveList } from "../../providers/active-list/useActiveList";
import type { ModalRef } from "@etm/web-ui-components";
import { Modal, useToast } from "@etm/web-ui-components";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import type {
  SubComponent as ISubComponent,
  SubComponentCreate,
  SubComponentMeasurementScale,
  SubComponentMeasurementScaleCreate,
} from "~/libs/models/subComponent.model";
import { SubComponentsSkeleton } from "./SubComponentsSkeleton";
import { SubComponentsEmptyPlaceHolder } from "./SubComponentsEmptyPlaceHolder";
import { ListTypeColors } from "../DomainCompCard";
import { SubComponent } from "./domain-sub-component";
import { SubComponentForm } from "../form/subComponents";
import type { DefaultFieldsFormData } from "../form/subComponents/DefaultFieldsForm";
import type { ScalesFormData } from "../form/subComponents/ScalesForm";

interface Props {
  modalRef: React.RefObject<ModalRef | null>;
}
export function DomainSubComponents({ modalRef }: Props) {
  const [createdSubComponentId, setCreatedSubComponentId] = useState<
    string | null
  >(null);
  const { componentId } = useActiveList();
  const { toast } = useToast();

  const { data: subComponents, ...subComponentsState } =
    useFindAll<ISubComponent>({
      path: `/components/${componentId}/subComponents`,
      tqOptions: {
        enabled: !!componentId,
        queryKey: ["subComponents", componentId],
      },
    });

  const { mutate: createSubComponent, ...createSubComponentState } =
    useAddMutation<ISubComponent, SubComponentCreate>("sub-components");

  const {
    mutate: createSubComponentMeasurementScales,
    ...createSubComponentMeasurementScalesState
  } = useAddMutation<
    SubComponentMeasurementScale[],
    SubComponentMeasurementScaleCreate[]
  >(`sub-components/${createdSubComponentId}/measurement-scales`);

  const onAddSubComponentSubmitHandler = (values: DefaultFieldsFormData) => {
    if (componentId) {
      createSubComponent(
        {
          data: {
            name: values.name,
            code: values.code,
            description: values.description,
            componentId: componentId,
            translations: values.translations ?? {},
          },
        },
        {
          onSuccess: (data) => {
            setCreatedSubComponentId(data.id);
            toast({
              title: "Success",
              message: "Sub Component created successfully",
              variant: "success",
            });

            subComponentsState.refetch();
          },
        }
      );
    }
  };

  const onAddScalesSubmitHandler = (values: ScalesFormData) => {
    if (createdSubComponentId) {
      createSubComponentMeasurementScales(
        {
          data: values.scales.map((scale) => ({
            subComponentId: createdSubComponentId ?? "",
            measurementScaleId: scale.measurementScaleId ?? "",
            description: scale.description ?? "",
            translations: scale.translations ?? {},
          })),
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              message: "Sub Component measurement scale created successfully",
              variant: "success",
            });

            setCreatedSubComponentId(null);
            modalRef.current?.closeModal();
            subComponentsState.refetch();
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col gap-5 overflow-y-auto h-full">
      {subComponentsState.isLoading && <SubComponentsSkeleton />}

      {subComponentsState.isSuccess &&
      subComponents?.total &&
      subComponents?.total > 0 ? (
        <>
          {subComponents?.data?.map((subComponent) => (
            <div
              key={subComponent.id}
              className="rounded-lg"
              style={{
                backgroundColor:
                  componentId === subComponent.id
                    ? `${ListTypeColors.Component}`
                    : "",
              }}
            >
              <SubComponent subComponent={subComponent} />
            </div>
          ))}
        </>
      ) : (
        !subComponentsState.isLoading && <SubComponentsEmptyPlaceHolder />
      )}

      <Modal
        ref={modalRef}
        title={`Add sub-component`}
        onOpenChange={(open) => {
          if (open) {
            setCreatedSubComponentId(null);
          }
        }}
      >
        <SubComponentForm
          createdSubComponentId={createdSubComponentId}
          onScalesSubmit={onAddScalesSubmitHandler}
          defaultFieldsLoading={createSubComponentState.isPending}
          defaultFieldsSuccess={createSubComponentState.isSuccess}
          scalesLoading={createSubComponentMeasurementScalesState.isPending}
          scalesSuccess={createSubComponentMeasurementScalesState.isSuccess}
          onDefaultFieldsSubmit={onAddSubComponentSubmitHandler}
        />
      </Modal>
    </div>
  );
}
