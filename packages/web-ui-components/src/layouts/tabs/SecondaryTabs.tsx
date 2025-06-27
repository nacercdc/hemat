import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../shadcn-ui";

interface TabOption {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface Props {
  defaultValue: string;
  options: TabOption[];
}

export function SecondaryTabs({ defaultValue, options }: Props) {
  return (
    <ShadcnTabs
      defaultValue={defaultValue}
      className="!mx-0 !px-0 min-h-full flex flex-col"
    >
      <TabsList className="flex w-full gap-6 justify-start mb-6 rounded-sm bg-basic-200/30 px-3 py-3 h-14">
        {options.map((op) => (
          <TabsTrigger
            key={op.value}
            value={op.value}
            className="data-[state=active]:shadow-none data-[state=active]:bg-secondary-50 data-[state=active]:text-secondary-400 data-[state=active]:font-bold !border-primary border-solid bg-transparent !ring-offset-transparent rounded-xl h-9 justify-start text-basic px-3 py-2"
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
