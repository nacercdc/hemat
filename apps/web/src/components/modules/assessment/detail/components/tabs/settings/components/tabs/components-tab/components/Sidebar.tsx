import { Icon } from "@iconify/react";
import { cn } from "~/utils/cn.util";

interface Component {
  id: string;
  name: string;
  code: string;
  description: string;
}

interface Props {
  activeComponent: Component | null;
  components: Component[] | null;
  onComponentSelect: (component: Component) => void;
}

export function Sidebar({
  activeComponent,
  components,
  onComponentSelect,
}: Props) {
  const onEditClickHandler = (_id: string) => {
    //TODO handle editing logic
  };
  return (
    <div className="flex flex-col gap-3 w-full md:w-1/4 overflow-y-auto bg-basic-200/30 p-3 rounded-l-sm">
      {components ? (
        components?.map((component) => (
          <div className="flex items-center gap-2 w-full">
            <div
              key={component.id}
              className={cn(
                "flex flex-1 items-center justify-between p-4 rounded-lg min-h-14 border border-basic-300 cursor-pointer",
                activeComponent?.id === component.id &&
                  "bg-secondary-50/50 border border-secondary-500"
              )}
              onClick={() => onComponentSelect(component)}
            >
              <div className="text-sm font-medium flex gap-2">
                {component.name}
                <Icon
                  icon="circum:edit"
                  className="w-5  h-5"
                  onClick={() => onEditClickHandler(component.id)}
                />
              </div>
              <Icon icon="ion:chevron-forward-outline" className="w-4 h-4" />
            </div>
            <div className="w-6">
              {activeComponent?.id === component.id && (
                <Icon
                  icon="gridicons:dropdown"
                  className="w-6 h-6 text-secondary-500 md:-rotate-90"
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <div>No components found</div>
      )}
    </div>
  );
}
