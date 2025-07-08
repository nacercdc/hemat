"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DomainComponentCollapsible } from "./DomainComponentCollapsible";
import type { CollapsibleItem as DomainComponent } from "./DomainToolsCollapsible";

interface Props {
  domainComponents: DomainComponent[];
}

export function DomainComponentCollapsibleList({ domainComponents }: Props) {
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

  return (
    <motion.div
      className="w-full flex flex-col gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {domainComponents.map((item, index) => (
        <motion.div key={index} variants={itemVariants} className="w-full">
          <DomainComponentCollapsible
            domainComponent={item}
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
