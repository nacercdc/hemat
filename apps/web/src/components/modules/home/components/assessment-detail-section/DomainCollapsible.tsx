"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/utils/cn.util";
import { DomainComponentCard } from "./DomainComponentCard";

interface Props {
  icon: React.ReactNode;
  title: string;
  isOpen: boolean;
  content: { title: string; content: string; score: number }[];
  onToggle: () => void;
}

export function DomainCollapsible({
  icon,
  title,
  isOpen,
  content,
  onToggle,
}: Props) {
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
            {content.map(({ content, score, title }, index) => (
              <DomainComponentCard
                key={index}
                content={content}
                score={score}
                title={title}
              />
            ))}
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
