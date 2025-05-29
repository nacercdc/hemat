"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Button, Drawer, DropdownMenu, Modal } from "@etm/web-ui-components";
import { DomainComponentForm } from "./form";

import type { ModalRef } from "@etm/web-ui-components";
import type { ItemDetailType, ListItemType, ListTypeLabel } from "..";
import type { ItemFormData } from "./form";

interface Props {
  item: ListItemType;
  type: ListTypeLabel;
  onClick?: (item: ListItemType) => void;
  getDetails?: (item: ListItemType) => Partial<ItemDetailType>;
}

export function DomainCompListItem({ item, type, onClick, getDetails }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const editItemModalRef = useRef<ModalRef>(null);

  const itemDetails = getDetails?.(item);

  const onEditItemSubmitHandler = (_values: ItemFormData) => {
    if (type === "Component") {
      //TODO: grab the selected domain from state, merge and perform edit component mutation
    }
    if (type === "SubComponent") {
      //TODO: grab the selected component from state, merge and perform edit subcomponent mutation
    }
    if (type === "Domain") {
      //TODO: perform domain edit mutation
    }
  };

  return (
    <div className="w-full flex items-center gap-5 rounded-lg border px-3">
      <DropdownMenu
        triggerTextAlign="center"
        align="center"
        trigger={
          <Icon
            icon="ph:dots-three-outline-fill"
            className="!w-4 !h-4 !text-dark rotate-90"
            onClick={(e) => e.stopPropagation()}
          />
        }
        options={[
          {
            value: "view",
            label: "View",
            leftNode: (
              <Icon icon="solar:eye-outline" className="!text-dark !w-4 !h-4" />
            ),
            onClick: () => {
              setDrawerOpen(true);
            },
          },
          {
            value: "edit",
            label: "Edit",
            leftNode: (
              <Icon
                icon="iconamoon:edit-light"
                className="!text-dark !w-4 !h-4"
              />
            ),
            onClick: () => {
              editItemModalRef.current?.openModal();
            },
          },
          {
            value: "delete",
            label: "Delete",
            leftNode: (
              <Icon
                icon="material-symbols-light:delete-outline"
                className="!text-dark !w-4 !h-4"
              />
            ),
            onClick: () => {
              //TODO: Implement deleting
            },
          },
        ]}
      />
      <div
        className="flex items-center justify-between w-full gap-5 cursor-pointer"
        onClick={() => onClick?.(item)}
      >
        <h5 className="text-sm font-medium">{item.name}</h5>
        <Button type="button" variant="ghost">
          <Icon
            icon="ion:chevron-back-outline"
            className="!w-4 !h-4 !text-dark rotate-180"
          />
        </Button>
      </div>
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-info/10 text-info p-2 px-3 text-xs">
              Code: 1
            </div>
            <h3 className="text-sm font-bold">{item.name}</h3>
          </div>
        }
        description={<span className="text-xs mt-5">{item.description}</span>}
      >
        {itemDetails && (
          <div className="border-[1px] rounded-md p-5 flex flex-col gap-5">
            {itemDetails.componentCount !== undefined && (
              <h6 className="text-xs font-medium">
                Components: {itemDetails.componentCount}
              </h6>
            )}
            {itemDetails.subcomponentCount !== undefined && (
              <h6 className="text-xs font-medium">
                Sub-Components: {itemDetails.subcomponentCount}
              </h6>
            )}
          </div>
        )}
      </Drawer>
      <Modal ref={editItemModalRef} title="Edit Role">
        <DomainComponentForm
          type={type}
          onSubmitHandler={onEditItemSubmitHandler}
          onCloseModal={() => editItemModalRef.current?.closeModal()}
          item={item}
        />
      </Modal>
    </div>
  );
}
