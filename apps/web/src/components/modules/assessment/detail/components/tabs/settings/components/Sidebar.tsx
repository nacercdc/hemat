/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from "@iconify/react";
import { cn } from "~/utils/cn.util";

interface Props<T> {
  activeItem: T | null;
  list: T[] | null;
  onItemSelect: (item: T) => void;
  displayKey: keyof T;
  groupByKey?: keyof T;
}

export function Sidebar<T extends Record<string, any>>({
  activeItem,
  list,
  onItemSelect,
  groupByKey,
  displayKey,
}: Props<T>) {
  const onEditClickHandler = (_id: string) => {
    // TODO handle editing logic
  };

  const groupedItems = list?.reduce(
    (acc, item) => {
      const groupKey = groupByKey
        ? (item[groupByKey] ?? "ungrouped")
        : "ungrouped";
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );

  const sortedGroups = groupedItems
    ? Object.entries(groupedItems).sort(([a], [b]) => a.localeCompare(b))
    : [];

  return (
    <div className="flex flex-col gap-3 w-full md:w-1/4 overflow-y-auto bg-basic-200/30 p-3 rounded-l-sm">
      {sortedGroups.length > 0 ? (
        sortedGroups.map(([groupKey, items], groupIndex) => (
          <div key={groupKey} className="flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 w-full">
                <div
                  className={cn(
                    "flex flex-1 items-center justify-between p-4 rounded-lg min-h-14 border border-basic-300 cursor-pointer",
                    activeItem?.id === item.id &&
                      "bg-secondary-50/50 border border-secondary-500"
                  )}
                  onClick={() => onItemSelect(item)}
                >
                  <div className="text-sm font-medium flex gap-2">
                    {item[displayKey] as string}
                    <Icon
                      icon="circum:edit"
                      className="w-5 h-5"
                      onClick={() => onEditClickHandler(item.id)}
                    />
                  </div>
                  <Icon
                    icon="ion:chevron-forward-outline"
                    className="w-4 h-4"
                  />
                </div>
                <div className="w-6">
                  {activeItem?.id === item.id && (
                    <Icon
                      icon="gridicons:dropdown"
                      className="w-6 h-6 text-secondary-500 md:-rotate-90"
                    />
                  )}
                </div>
              </div>
            ))}
            {groupIndex < sortedGroups.length - 1 && (
              <hr className="my-2 mr-8 border-dark-lighter/70 " />
            )}
          </div>
        ))
      ) : (
        <div>No items found</div>
      )}
    </div>
  );
}
