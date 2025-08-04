"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/utils/cn.util";
import { Button } from "@etm/web-ui-components";
import { MeasurementScaleCard } from "./MeasurementScaleCard";
import type { Variants } from "framer-motion";
import type { ITemplateComponent } from "./DomainToolsCollapsible";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { MeasurementScale } from "~/libs/models/answer.model";

interface ITemplateSubComponent {
  id: string;
  name: string;
  description: string;
  measurementScales: MeasurementScale[];
}
interface Props {
  component: ITemplateComponent;
  isOpen: boolean;
  onToggle: () => void;
}

export function DomainComponentCollapsible({
  component,
  isOpen,
  onToggle,
}: Props) {
  const { data: subComponents, ...subComponentsState } = useFindAll<
    ITemplateSubComponent[]
  >({
    path: `/dashboard/template/components/${component?.id}/subcomponents`,
    isProtected: false,
    tqOptions: { enabled: isOpen },
  });

  const variants: Variants = {
    open: {
      height: "auto",
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeIn",
        when: "afterChildren",
      },
    },
  };

  const contentVariants: Variants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  if (subComponentsState.isLoading || subComponentsState.isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-w-max relative">
      <div className="absolute top-1 -left-4">
        <Icon
          icon="clarity:child-arrow-line"
          className="w-8 h-8 text-[#11B050]"
        />
      </div>
      <div className="ml-4 w-full">
        <Button variant="ghost" onClick={onToggle} size="xl">
          <span className="text-dark font-normal">{component?.name}</span>
        </Button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={variants}
              initial="closed"
              animate="open"
              exit="closed"
              className={cn(
                "overflow-hidden rounded-md mt-3 flex flex-col gap-4 w-full",
                isOpen ? "py-5 px-10" : "py-0"
              )}
            >
              {(subComponents as unknown as ITemplateSubComponent[])?.map(
                (sub) => (
                  <motion.div
                    key={sub.name}
                    variants={contentVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="relative w-full"
                  >
                    <div className="absolute -top-3 -left-6">
                      <Icon
                        icon="clarity:child-arrow-line"
                        className="w-8 h-8 text-[#FFC000]"
                      />
                    </div>
                    <div className="flex flex-col gap-3 pl-3 w-full">
                      <span className="text-xs font-bold">{sub.name}</span>
                      <p className="text-dark-light text-xs ml-2 text-wrap max-w-[800px]">
                        {sub.name}
                      </p>
                      <div className="flex gap-4 ml-2 w-full overflow-x-auto">
                        {[1, 2, 3, 4, 5].map((curIndex) => (
                          <MeasurementScaleCard
                            scale={curIndex}
                            key={curIndex}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
