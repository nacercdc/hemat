"use client";

import { Button } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { PageContainer } from "~/components/modules/components/PageContainer";
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

export function DomainFill() {
  const router = useRouter();
  const [activeComponent, setActiveComponent] = useState<Component | undefined>(
    undefined
  );
  const [activeSubComponent, setActiveSubComponent] = useState<
    SubComponent | undefined
  >(undefined);

  const assessmentName = "Assessment 1";
  const assessmentId = "1";

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

  // Simulate API call for form submission
  const submitFormData = useCallback(
    (subComponentId: string, data: unknown) => {
      try {
        // Replace with actual API call
        console.log(
          `Submitting form for subcomponent ${subComponentId}:`,
          data
        );
        // Example: await fetch('/api/submit', { method: 'POST', body: JSON.stringify({ subComponentId, data }) });
      } catch (error) {
        console.error("Form submission failed:", error);
      }
    },
    []
  );

  const handleNext = useCallback(() => {
    if (!activeComponent || !activeSubComponent) return;

    const currentComponentIndex = domain.components.findIndex(
      (c) => c.id === activeComponent.id
    );
    const currentSubComponentIndex = activeComponent.subComponents.findIndex(
      (sc) => sc.id === activeSubComponent.id
    );

    // Submit form data immediately
    submitFormData(activeSubComponent.id, {
      description: activeSubComponent.description,
      // Add your form data here
    });

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
  }, [
    activeComponent,
    activeSubComponent,
    router,
    submitFormData,
    assessmentId,
  ]);

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
        <div className="flex flex-col sm:flex-row gap-4 h-full">
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
                <div className="flex flex-col gap-4">
                  <span className="text-lg font-bold">
                    {activeSubComponent.name}
                  </span>
                  <p className="text-xs font-medium text-dark-light">
                    {activeSubComponent.description}
                  </p>
                  {/* Add your form inputs here */}
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
                onClick={handleNext}
                size="xl"
                disabled={!activeComponent || !activeSubComponent}
              >
                {isLast ? "Complete" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
