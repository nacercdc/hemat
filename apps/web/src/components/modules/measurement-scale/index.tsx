"use client";

import type { ModalRef } from "@etm/web-ui-components";
import { Button, Modal } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";

import { ScaleTable } from "./components/table";
import { useRef } from "react";
import type { ScaleFormData } from "./components/form";
import { ScaleForm } from "./components/form";
import { PageContainer } from "../components/PageContainer";

export default function MeasurementScale() {
  const addScaleModalRef = useRef<ModalRef>(null);

  const openAddScaleModal = () => addScaleModalRef.current.openModal();
  const onCancelScaleFormHandler = () => addScaleModalRef.current?.closeModal();
  const onSubmitScaleFormHandler = (_value: ScaleFormData) => {
    //TODO: Add submit logic here
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
            onSubmitScaleFormHandler={onSubmitScaleFormHandler}
            onCancelScaleFormHandler={onCancelScaleFormHandler}
          />
        </div>
      </Modal>
    </PageContainer>
  );
}
