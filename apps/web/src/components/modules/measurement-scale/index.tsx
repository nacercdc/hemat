"use client";

import type { ModalRef } from "@etm/web-ui-components";
import { Button, Modal } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ContentLayout } from "~/components/layouts/dashboard/components/content-layout";
import TitleBar from "~/components/layouts/dashboard/components/title-bar";
import { ScaleTable } from "./components/table";
import { useRef } from "react";
import { ScaleForm } from "./components/form";

export default function MeasurementScale() {
  const addScaleModalRef = useRef<ModalRef>(null);

  const openAddScaleModal = () => {
    if (addScaleModalRef.current) {
      addScaleModalRef.current.openModal();
    }
  };
  return (
    <ContentLayout>
      <TitleBar title="Measurement Scale">
        <Button
          leftNode={<Icon icon={"material-symbols:add"} />}
          size="lg"
          onClick={openAddScaleModal}
        >
          Add
        </Button>
      </TitleBar>
      <ScaleTable />
      <Modal ref={addScaleModalRef}>
        <div className="flex flex-col gap-4">
          <ScaleForm onSubmitScaleFormHandler={(value)=>console.log(value) } />
        </div>
      </Modal>
    </ContentLayout>
  );
}
