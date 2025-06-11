"use client";

import { Button, CheckboxGroupRHF, ETMEditor } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { PageContainer } from "~/components/modules/components/PageContainer";
import type { Scale } from "~/libs/models/scale.model";
import { cn } from "~/utils/cn.util";

interface SubComponent {
  id: string;
  name: string;
  description: string;
}

interface Component {
  id: string;
  name: string;
  subComponents: SubComponent[];
}

interface Domain {
  id: string;
  name: string;
  components: Component[];
}

const domain: Domain = {
  id: "1",
  name: "Domain 1",
  components: [
    {
      id: "1",
      name: "Component 1",
      subComponents: [
        {
          id: "1",
          name: "SubComponent 1",
          description:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum voluptas aliquid asperiores, dolores nesciunt corrupti quae adipisci, vel, mollitia deleniti repudiandae! Dolorem dolor recusandae aliquam laboriosam mollitia rerum, veritatis blanditiis assumenda et obcaecati maiores totam vel quia eaque numquam molestias ducimus sequi quae similique consequatur. Dolorum perspiciatis rerum unde sint?",
        },
        { id: "2", name: "SubComponent 2", description: "Description 2" },
      ],
    },
    {
      id: "2",
      name: "Component 2",
      subComponents: [
        { id: "3", name: "SubComponent 3", description: "Description 3" },
        { id: "4", name: "SubComponent 4", description: "Description 4" },
      ],
    },
    {
      id: "3",
      name: "Component 3",
      subComponents: [
        { id: "5", name: "SubComponent 5", description: "Description 5" },
        { id: "6", name: "SubComponent 6", description: "Description 6" },
      ],
    },
    {
      id: "4",
      name: "Component 4",
      subComponents: [
        { id: "7", name: "SubComponent 7", description: "Description 7" },
        { id: "8", name: "SubComponent 8", description: "Description 8" },
      ],
    },
    {
      id: "5",
      name: "Component 5",
      subComponents: [
        { id: "9", name: "SubComponent 9", description: "Description 9" },
        { id: "10", name: "SubComponent 10", description: "Description 10" },
      ],
    },
  ],
};

const measurementScales: Scale[] = [
  {
    id: "1",
    name: "Initial",
    rate: 1,
    description: "Initial",
    color: "#fdffbb",
  },
  {
    id: "2",
    name: "Developing",
    rate: 2,
    description: "Developing",
    color: "#fdffff",
  },
  {
    id: "3",
    name: "Mature",
    rate: 3,
    description: "Mature",
    color: "#fdffdd",
  },
  {
    id: "4",
    name: "Optimizing",
    rate: 4,
    description: "Optimizing",
    color: "#fdffee",
  },
  {
    id: "5",
    name: "Optimizing",
    rate: 5,
    description: "Optimizing",
    color: "#fdffcc",
  },
];

const formattedMeasurementScales = measurementScales.map((scale) => ({
  id: scale.id,
  name: (scale.name + " (" + scale.rate + ")").toString(),
  color: scale.color,
  description: scale.description,
  rate: scale.rate,
}));

const subComponentFormSchema = z.object({
  measurementScale: z.object({
    id: z.string().min(1, { message: "Measurement scale is required" }),
  }),
  evidence: z.union([
    z.string().min(1, { message: "Evidence is required" }),
    z.instanceof(File),
  ]),
  reference: z.union([
    z.string().min(1, { message: "Reference is required" }),
    z.instanceof(File),
  ]),
});

export type SubComponentFormData = z.infer<typeof subComponentFormSchema>;

export function DomainFill() {
  const router = useRouter();
  const [activeComponent, setActiveComponent] = useState<Component | undefined>(
    undefined
  );
  const [activeSubComponent, setActiveSubComponent] = useState<
    SubComponent | undefined
  >(undefined);
  const [scale, setScale] = useState<Scale[] | undefined>(undefined);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<SubComponentFormData>({
    defaultValues: {
      measurementScale: { id: "" },
      evidence: "",
      reference: "",
    },
    resolver: zodResolver(subComponentFormSchema),
    mode: "onChange",
  });

  const assessmentName = "Assessment 1";
  const assessmentId = "1";

  console.log(watch("evidence"));

  // Initialize first component and subcomponent
  useEffect(() => {
    if (domain.components.length > 0) {
      const firstComponent = domain.components[0];
      setActiveComponent(firstComponent);
      if (firstComponent && firstComponent.subComponents.length > 0) {
        setActiveSubComponent(firstComponent.subComponents[0]);
      }
    }
  }, []);

  // Reset form when activeSubComponent changes
  useEffect(() => {
    reset({
      measurementScale: { id: "" },
      evidence: "",
      reference: "",
    });
    setScale(undefined);
  }, [activeSubComponent, reset]);

  // Handle form submission and navigation
  const onSubmit = useCallback(
    (data: SubComponentFormData) => {
      if (!activeComponent || !activeSubComponent) return;

      // Log form data (replace with actual submission logic if needed)
      console.log(
        `Form submitted for subcomponent ${activeSubComponent.id}:`,
        data
      );

      const currentComponentIndex = domain.components.findIndex(
        (c) => c.id === activeComponent.id
      );
      const currentSubComponentIndex = activeComponent.subComponents.findIndex(
        (sc) => sc.id === activeSubComponent.id
      );

      // Navigate to next subcomponent or component
      if (currentSubComponentIndex < activeComponent.subComponents.length - 1) {
        setActiveSubComponent(
          activeComponent.subComponents[currentSubComponentIndex + 1]
        );
      } else if (currentComponentIndex < domain.components.length - 1) {
        const nextComponent = domain.components[currentComponentIndex + 1];
        setActiveComponent(nextComponent);
        if (nextComponent && nextComponent.subComponents.length > 0) {
          setActiveSubComponent(nextComponent.subComponents[0]);
        }
      } else {
        router.push(`/assessment/${assessmentId}/complete`);
      }
    },
    [activeComponent, activeSubComponent, router, assessmentId]
  );

  const handlePrevious = useCallback(() => {
    if (!activeComponent || !activeSubComponent) return;

    const currentComponentIndex = domain.components.findIndex(
      (c) => c.id === activeComponent.id
    );
    const currentSubComponentIndex = activeComponent.subComponents.findIndex(
      (sc) => sc.id === activeSubComponent.id
    );

    if (currentSubComponentIndex > 0) {
      setActiveSubComponent(
        activeComponent.subComponents[currentSubComponentIndex - 1]
      );
    } else if (currentComponentIndex > 0) {
      const prevComponent = domain.components[currentComponentIndex - 1];
      setActiveComponent(prevComponent);
      setActiveSubComponent(
        prevComponent?.subComponents[prevComponent.subComponents.length - 1]
      );
    }
  }, [activeComponent, activeSubComponent]);

  const onBackHandler = useCallback(() => {
    router.push(`/assessment/${assessmentId}/detail`);
  }, [router, assessmentId]);

  const isFirst =
    activeComponent?.id === domain.components[0]?.id &&
    activeSubComponent?.id === activeComponent?.subComponents[0]?.id;
  const isLast =
    activeComponent?.id ===
      domain.components[domain.components.length - 1]?.id &&
    activeSubComponent?.id ===
      activeComponent?.subComponents[activeComponent.subComponents.length - 1]
        ?.id;

  return (
    <PageContainer
      pageTitle={`${assessmentName} / Fill`}
      includeBreadcrumb={false}
      onBack={onBackHandler}
    >
      <div className="flex flex-col gap-5 h-full">
        <div className="flex w-full h-12 bg-basic-200 rounded-md px-5 py-3">
          <span className="text-xl font-bold">{`${domain.name} / Components`}</span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row gap-4 h-full"
        >
          <div className="flex flex-col gap-3 w-full sm:w-1/4 overflow-y-auto">
            {domain.components.map((component) => (
              <div
                key={component.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl h-14 border border-basic-300 cursor-pointer",
                  activeComponent?.id === component.id && "bg-layout-bg"
                )}
                onClick={() => {
                  setActiveComponent(component);
                  setActiveSubComponent(component.subComponents[0]);
                }}
              >
                <span className="text-sm font-medium">{component.name}</span>
                <Icon icon="ion:chevron-forward-outline" className="w-4 h-4" />
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full sm:w-3/4">
            <div className="flex flex-col w-full h-full p-7 gap-7 border border-basic-300 rounded-lg">
              {activeSubComponent && (
                <div className="flex flex-col gap-10">
                  <span className="text-lg font-bold">
                    {activeSubComponent.name}
                  </span>
                  <p className="text-xs font-medium text-dark-light">
                    {activeSubComponent.description}
                  </p>
                  <div className="flex w-1/4">
                    <CheckboxGroupRHF<Scale, SubComponentFormData>
                      control={control}
                      name="measurementScale"
                      options={formattedMeasurementScales}
                      onValuesChange={(values: Scale[]) => {
                        setScale(values);
                      }}
                      values={scale}
                      valueKey="id"
                      labelKey="name"
                      size="md"
                      layout="horizontal"
                      selectionMode="single"
                    />
                    {errors.measurementScale?.id && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.measurementScale.id.message}
                      </p>
                    )}
                  </div>
                  <Controller
                    control={control}
                    name="evidence"
                    render={({ field: { onChange, value } }) => (
                      <ETMEditor
                        label="Evidence"
                        description="Attach a picture"
                        control={control}
                        onEditorStateChange={onChange}
                        value={value}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="reference"
                    render={({ field: { onChange, value } }) => (
                      <ETMEditor
                        label="Reference"
                        description="Attach a reference"
                        control={control}
                        onEditorStateChange={onChange}
                        value={value}
                      />
                    )}
                  />
                </div>
              )}
            </div>
            <div className="flex w-full gap-4 justify-between mt-5">
              <Button
                onClick={handlePrevious}
                disabled={isFirst}
                variant="outline"
                size="xl"
              >
                Previous
              </Button>
              <Button
                type="submit"
                size="xl"
                disabled={!activeComponent || !activeSubComponent || !isValid}
              >
                {isLast ? "Complete" : "Next"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
