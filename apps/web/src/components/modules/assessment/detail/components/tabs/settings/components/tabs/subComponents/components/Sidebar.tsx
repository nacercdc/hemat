import { Icon } from "@iconify/react";
import { cn } from "~/utils/cn.util";

interface SubComponent {
  id: string;
  name: string;
  code: string;
  description: string;
}

interface Props {
  activeSubComponent: SubComponent | null;
  subComponents: SubComponent[] | null;
  onSubComponentSelect: (subComponent: SubComponent) => void;
}

export function Sidebar({
  activeSubComponent,
  subComponents,
  onSubComponentSelect,
}: Props) {
  const onEditClickHandler = (_id: string) => {
    //TODO handle editing logic
  };
  return (
    <div className="flex flex-col gap-3 w-full md:w-1/4 overflow-y-auto bg-basic-200/30 p-3 rounded-l-sm">
      {subComponents ? (
        subComponents?.map((subComponent) => (
          <div className="flex items-center gap-2 w-full">
            <div
              key={subComponent.id}
              className={cn(
                "flex flex-1 items-center justify-between p-4 rounded-lg min-h-14 border border-basic-300 cursor-pointer",
                activeSubComponent?.id === subComponent.id &&
                  "bg-secondary-50/50 border border-secondary-500"
              )}
              onClick={() => onSubComponentSelect(subComponent)}
            >
              <div className="text-sm font-medium flex gap-2">
                {subComponent.name}
                <Icon
                  icon="circum:edit"
                  className="w-5  h-5"
                  onClick={() => onEditClickHandler(subComponent.id)}
                />
              </div>
              <Icon icon="ion:chevron-forward-outline" className="w-4 h-4" />
            </div>
            <div className="w-6">
              {activeSubComponent?.id === subComponent.id && (
                <Icon
                  icon="gridicons:dropdown"
                  className="w-6 h-6 text-secondary-500 md:-rotate-90"
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <div>No SubComponents found</div>
      )}
    </div>
  );
}
