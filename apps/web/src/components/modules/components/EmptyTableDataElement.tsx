import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@etm/web-ui-components";

interface Props {
  icon: React.ReactNode;
  title: string;
  body: string;
  actionText: string;
  action?: () => void;
}

export function EmptyTableDataElement({
  icon,
  title,
  body,
  actionText,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-tbaccent">
        {icon}
      </div>
      <h6 className="text-secondary text-sm">{title}</h6>
      <h6 className="text-dark-light text-sm text-center">{body}</h6>
      <Button
        size="lg"
        variant="outline"
        leftNode={<Icon icon="si:add-fill" />}
        onClick={action}
      >
        {actionText}
      </Button>
    </div>
  );
}
