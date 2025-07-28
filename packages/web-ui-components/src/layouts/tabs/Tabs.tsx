import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../shadcn-ui";

interface TabOption<T extends string> {
  value: T;
  label: React.ReactNode;
  content?: React.ReactNode;
}

interface Props<T extends string> {
  defaultValue: T;
  options: readonly TabOption<T>[];
  onTabClick?: (value: T) => void;
}

export function Tabs<T extends string>({
  defaultValue,
  options,
  onTabClick,
}: Props<T>) {
  return (
    <ShadcnTabs defaultValue={defaultValue} className="px-0">
      <TabsList className="flex w-full gap-6 !bg-transparent justify-start mb-6 overflow-x-auto">
        {options.map((op) => (
          <TabsTrigger
            key={op.value}
            value={op.value}
            onClick={() => onTabClick?.(op.value)}
            className="data-[state=active]:shadow-none data-[state=active]:border-b-[0.2rem] data-[state=active]:text-primary data-[state=active]:font-bold !border-primary border-solid !bg-transparent !ring-offset-transparent rounded-none justify-start text-basic px-0"
          >
            {op.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {options.map((op) => (
        <TabsContent
          key={op.value}
          value={op.value}
          className="flex flex-col flex-1 w-full min-h-full"
        >
          {op.content}
        </TabsContent>
      ))}
    </ShadcnTabs>
  );
}
