"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DomainComponentCollapsible } from "./DomainComponentCollapsible";
import type { ITemplateComponent } from "./DomainToolsCollapsible";
import { Skeleton } from "@etm/web-ui-components";

interface Props {
  domainComponents: ITemplateComponent[];
  isLoading?: boolean;
}

export function DomainComponentCollapsibleList({
  domainComponents,
  isLoading = false,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return <DomainComponentSkeleton />;
  }

  return (
    <motion.div
      className="w-full flex flex-col gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {domainComponents?.map((item, index) => (
        <motion.div key={index} variants={itemVariants} className="w-full">
          <DomainComponentCollapsible
            component={item}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

interface IconWrapperProps {
  children: React.ReactNode;
  backColor: string;
}

export function IconWrapper({ children, backColor }: IconWrapperProps) {
  return (
    <div
      className="flex items-center justify-center rounded-full w-8 h-8"
      style={{ backgroundColor: `${backColor}` }}
    >
      {children}
    </div>
  );
}

function DomainComponentSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="w-[50%] h-5 rounded-sm" />
      ))}
    </div>
  );
}
