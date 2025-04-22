import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../shadcn-ui";

interface TabOption {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface Props {
  defaultValue: string;
  options: TabOption[];
}

export function Tabs({ defaultValue, options }: Props) {
  return (
    <ShadcnTabs defaultValue={defaultValue} className="px-0">
      <TabsList className="flex w-full gap-6 !bg-transparent justify-start mb-6">
        {options.map((op) => (
          <TabsTrigger
            key={op.value}
            value={op.value}
            className="data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:text-info-800 data-[state=active]:font-bold !border-info-800 border-solid !bg-transparent !ring-offset-transparent rounded-none justify-start px-0"
          >
            {op.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {options.map((op) => (
        <TabsContent key={op.value} value={op.value}>
          {op.content}
        </TabsContent>
      ))}
    </ShadcnTabs>
  );
}
