"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/utils/cn.util";
import {
  SubComponentCard,
  DomainComponentCardSkeleton,
} from "./SubComponentCard";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";

interface ISubComponent {
  id: string;
  name: string;
  description: string;
  subComponentId: string;
  averageRate: number;
}

interface Props {
  icon: React.ReactNode;
  title: string;
  isOpen: boolean;
  id: string;
  onToggle: () => void;
}

export function ComponentCollapsible({
  icon,
  title,
  isOpen,
  id,
  onToggle,
}: Props) {
  const { data: subComponents, ...subComponentsState } = useFindAll<
    ISubComponent[]
  >({
    path: `/dashboard/components/${id}/subcomponents/average-rate`,
    isProtected: false,
    tqOptions: {
      queryKey: ["subcomponents", id],
      enabled: isOpen,
    },
  });

  const variants = {
    open: {
      height: "auto",
      opacity: 1,
      y: 0,
      transition: {
        height: { stiffness: 350, damping: 5, duration: 0.4 },
        y: { stiffness: 350, damping: 5, duration: 0.4 },
        opacity: { duration: 0.3 },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      y: -20,
      transition: {
        height: { stiffness: 350, damping: 5, duration: 0.4 },
        y: { stiffness: 350, damping: 5, duration: 0.4 },
        opacity: { duration: 0.3 },
      },
    },
  };

  const isLoading =
    subComponentsState.isLoading || subComponentsState.isFetching;

  return (
    <div className="w-full my-3 mx-5">
      <button
        onClick={onToggle}
        className="px-5 py-3 bg-white text-dark border-none rounded-sm cursor-pointer w-full flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronIcon isOpen={isOpen} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            className={cn(
              "overflow-hidden bg-white rounded-sm mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4",
              isOpen ? "py-5 px-10" : "py-0 px-5"
            )}
          >
            {!isLoading &&
              (subComponents as unknown as ISubComponent[])?.map(
                ({ description, averageRate, name }, index) => (
                  <SubComponentCard
                    key={index}
                    content={description}
                    score={averageRate}
                    title={name}
                  />
                )
              )}
            {isLoading && <DomainComponentCardSkeleton />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ChevronIconProps {
  isOpen: boolean;
}

function ChevronIcon({ isOpen }: ChevronIconProps) {
  return (
    <motion.div
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <Icon
        icon="ion:chevron-back-outline"
        className="text-dark !w-6 !h-6 -rotate-90"
      />
    </motion.div>
  );
}
