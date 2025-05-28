import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@etm/web-ui-components/shadcn-ui/index";

interface TabOption {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface Props {
  defaultValue: string;
  options: TabOption[];
}

export function UpsideDownInvertedTabs({ defaultValue, options }: Props) {
  return (
    <ShadcnTabs defaultValue={defaultValue} className="px-0">
      <TabsList className="flex w-full !bg-transparent justify-start">
        {options.map((op) => (
          <div className="flex flex-col items-center gap-4" key={op.value}>
            <TabsTrigger
              key={op.value}
              value={op.value}
              className="group flex flex-col gap-2 data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:font-bold !bg-transparent !ring-offset-transparent justify-start text-basic px-0"
            >
              <div
                key={op.value}
                className={`w-32 h-4 rounded-lg border-b-8 border-transparent data-[state=active]:shadow-none group-data-[state=active]:!border-primary`}
              ></div>

              {op.label}
            </TabsTrigger>
          </div>
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
