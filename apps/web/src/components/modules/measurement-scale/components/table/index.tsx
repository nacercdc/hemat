"use client";

import { Icon } from "@iconify/react";
import type { ModalRef } from "@etm/web-ui-components";
import { Table as ETMTable, Modal } from "@etm/web-ui-components";
import type { Scale } from "./ScaleTableColumns";
import { ScaleTableColumns } from "./ScaleTableColumns";
import { EmptyTableDataElement } from "~/components/modules/components/EmptyTableDataElement";
import { useRef } from "react";
import { ScaleForm } from "../form";

export function ScaleTable() {
  const addScaleModalRef = useRef<ModalRef>(null);

  const OnEmptyDataElement = (
    <EmptyTableDataElement
      icon={
        <Icon
          icon="material-symbols-light:scale-balance"
          className="w-16 h-16"
        />
      }
      title="No Scales Found"
      body="You can add a new scale by clicking the button below."
      actionText="Add Scale"
      action={() => addScaleModalRef.current?.openModal()}
    />
  );

  return (
    <div className="h-full bg-card pt-4 rounded-md">
      <ETMTable<Scale>
        collectionName="Scales"
        columns={ScaleTableColumns({
          refetch: () => {
            return console.log("Refetch called");
          },
        })}
        data={[
          {
            id: 1,
            name: "Scale 1",
            rate: 1.0,
            color: "#FF5733",
            description: "This is a sample scale.",
          },
          {
            id: 2,
            name: "Scale 2",
            rate: 2.0,
            color: "#33FF57",
            description: "This is another sample scale.",
          },
          {
            id: 3,
            name: "Scale 3",
            rate: 3.0,
            color: "#3357FF",
            description: "This is yet another sample scale.",
          },
          {
            id: 4,
            name: "Scale 4",
            rate: 4.0,
            color: "#FF33A1",
            description: "This is a different sample scale.",
          },
          {
            id: 5,
            name: "Scale 5",
            rate: 5.0,
            color: "#A133FF",
            description: "This is a unique sample scale.",
          },
        ]}
        totalItems={10}
        isLoading={false}
        pageSizeOptions={[10, 25, 50, 100]}
        enableRowSelection={false}
        onEmptyDataElement={OnEmptyDataElement}
      />
      <Modal
        ref={addScaleModalRef}
      >
      <ScaleForm onSubmitScaleFormHandler={(value)=>console.log(value) } />
      </Modal>
    </div>
  );
}
