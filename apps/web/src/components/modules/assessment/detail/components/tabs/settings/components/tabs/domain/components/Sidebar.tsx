import { Icon } from "@iconify/react";
import { cn } from "~/utils/cn.util";

interface Domain {
  id: string;
  name: string;
  code: string;
  description: string;
}

interface Props {
  activeDomain: Domain | null;
  domains: Domain[] | null;
  onDomainSelect: (domain: Domain) => void;
}

export function Sidebar({ activeDomain, domains, onDomainSelect }: Props) {
  const onEditClickHandler = (_id: string) => {
    //TODO handle editing logic
  };
  return (
    <div className="flex flex-col gap-3 w-full md:w-1/4 overflow-y-auto bg-basic-200/30 p-3 rounded-l-sm">
      {domains ? (
        domains?.map((domain) => (
          <div className="flex items-center gap-2 w-full">
            <div
              key={domain.id}
              className={cn(
                "flex flex-1 items-center justify-between p-4 rounded-lg min-h-14 border border-basic-300 cursor-pointer",
                activeDomain?.id === domain.id &&
                  "bg-secondary-50/50 border border-secondary-500"
              )}
              onClick={() => onDomainSelect(domain)}
            >
              <div className="text-sm font-medium flex gap-2">
                {domain.name}{" "}
                <Icon
                  icon="circum:edit"
                  className="w-5  h-5"
                  onClick={() => onEditClickHandler(domain.id)}
                />
              </div>
              <Icon icon="ion:chevron-forward-outline" className="w-4 h-4" />
            </div>
            <div className="w-6">
              {activeDomain?.id === domain.id && (
                <Icon
                  icon="gridicons:dropdown"
                  className="w-6 h-6 text-secondary-500 md:-rotate-90"
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <div>No domains found</div>
      )}
    </div>
  );
}
