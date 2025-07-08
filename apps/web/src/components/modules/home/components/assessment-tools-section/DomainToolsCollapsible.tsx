"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/utils/cn.util";
import { DomainComponentCollapsibleList } from "./DomainComponentCollapsibleList";
import { collapsibleItems } from "../../constants";
import type { Domain } from "~/libs/models/domain.model";

export interface CollapsibleItem {
  icon: React.ReactNode;
  color: string;
  title: string;
  domain: Domain;
  content: { title: string; content: string; score: number }[];
}

const BorderColor = "#00B0F0";

interface Props {
  domain: Domain;
  isOpen: boolean;
  onToggle: () => void;
}

export function DomainToolsCollapsible({ domain, isOpen, onToggle }: Props) {
  const [domainComponents, setDomainComponents] = useState<CollapsibleItem[]>();

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

  useEffect(() => {
    if (domain) {
      setDomainComponents(
        collapsibleItems.filter((cItem) => cItem.domain.name === domain.name)
      );
    }
  }, [domain]);

  return (
    <div className="w-full">
      <button
        onClick={onToggle}
        className="px-5 py-5 bg-white text-dark rounded-sm cursor-pointer w-full flex justify-between items-center border-l-2"
        style={{ borderLeftColor: `${BorderColor}` }}
      >
        <span>{domain.name}</span>
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
              "overflow-x-auto bg-[#00B0F00D] rounded-md mt-3 flex flex-col gap-4 w-full",
              isOpen ? "py-5 px-10" : "py-0 px-5"
            )}
          >
            {
              <DomainComponentCollapsibleList
                domainComponents={domainComponents || []}
              />
            }
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
