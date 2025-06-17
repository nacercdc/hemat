import React from "react";
import type { ListItemType, ListTypeLabel } from "..";

interface Props {
  type: ListTypeLabel;
  isOpen: boolean;
  item: ListItemType;
}

const ItemDetails = ({ isOpen = false, item }: Props) => {
  if (!isOpen || !item) {
    return null;
  }

  return (
    <div className="rounded-md flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-info/10 text-info p-2 px-3 text-xs">
          Code: {item.code}
        </div>
        <h3 className="text-sm font-bold">{item.name}</h3>
      </div>
      <span className="text-xs text-dark-light">{item.description}</span>
      <div className="flex flex-col gap-2 border border-basic-300 rounded-md p-3">
        {item?.componentsCount !== undefined && (
          <h6 className="text-xs font-medium">
            Components: {item?.componentsCount}
          </h6>
        )}
        {item?.subComponentsCount !== undefined && (
          <h6 className="text-xs font-medium">
            Sub-Components: {item?.subComponentsCount}
          </h6>
        )}
      </div>
    </div>
  );
};
export default ItemDetails;
