"use client";

import type { ModalRef } from "@etm/web-ui-components";
import { Button, Modal, useToast } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";

import { ScaleTable } from "./components/table";
import { useRef } from "react";
import type { ScaleFormData } from "./components/form";
import { ScaleForm } from "./components/form";
import { PageContainer } from "../components/PageContainer";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import type { Scale, ScaleCreate } from "~/libs/models/scale.model";

export default function MeasurementScale() {
  const addScaleModalRef = useRef<ModalRef>(null);
  const toaster = useToast();

  const { mutate: createScale, ...createScaleState } = useAddMutation<
    Scale,
    ScaleCreate
  >("measurement-scales");

  const openAddScaleModal = () => addScaleModalRef.current.openModal();
  const onCancelScaleFormHandler = () => addScaleModalRef.current?.closeModal();

  const onSubmitScaleFormHandler = (data: ScaleFormData) => {
    console.log(data, "Subm");
    createScale(
      {
        data: {
          ...data,
          translations: {
            en: {
              name: "Initial",
              description: "Domain covering public health initiatives",
            },
            fr: {
              name: "Santé Publique",
              description: "Domaine couvrant les initiatives de santé publique",
            },
          },
        },
        isProtected: true,
      },
      {
        onSuccess: () => {
          addScaleModalRef.current?.closeModal();
          toaster.toast({
            title: "Success",
            message: "Scale created successfully",
            variant: "success",
          });
        },
      }
    );
  };

  return (
    <PageContainer
      pageTitle="Measurement Scale"
      includeBreadcrumb={false}
      actionNodes={
        <Button
          leftNode={
            <Icon icon={"material-symbols:add"} className="!w-5 !h-5" />
          }
          size="lg"
          onClick={openAddScaleModal}
        >
          Create
        </Button>
      }
    >
      <ScaleTable />
      <Modal ref={addScaleModalRef}>
        <div className="flex flex-col gap-4">
          <ScaleForm
            isLoading={createScaleState.isPending}
            onSubmitScaleFormHandler={onSubmitScaleFormHandler}
            onCancelScaleFormHandler={onCancelScaleFormHandler}
          />
        </div>
      </Modal>
    </PageContainer>
  );
}
