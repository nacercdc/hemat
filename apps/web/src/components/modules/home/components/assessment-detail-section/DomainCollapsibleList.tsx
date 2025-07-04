"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { DomainCollapsible } from "./DomainCollapsible";

interface CollapsibleItem {
  icon: React.ReactNode;
  title: string;
  content: { title: string; content: string; score: number }[];
}

//Dummy data for domain score detail
const items: CollapsibleItem[] = [
  {
    icon: (
      <IconWrapper backColor="#00B0F024">
        <Icon icon="fluent-mdl2:party-leader" />
      </IconWrapper>
    ),
    title: "Section 1",
    content: [
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
    ],
  },
  {
    icon: (
      <IconWrapper backColor="#FFC00024">
        <Icon icon="maki:communications-tower" />
      </IconWrapper>
    ),
    title: "Section 2",
    content: [
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
    ],
  },
  {
    icon: (
      <IconWrapper backColor="#348F4124">
        <Icon icon="carbon:ibm-knowledge-catalog-standard" />
      </IconWrapper>
    ),
    title: "Section 3",
    content: [
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
    ],
  },
  {
    icon: (
      <IconWrapper backColor="#FFFD0224">
        <Icon icon="fluent-mdl2:workforce-management" />
      </IconWrapper>
    ),
    title: "Section 4",
    content: [
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "lorem",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
    ],
  },
];

export function DomainCollapsibleList() {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="px-52 pr-64 w-full bg-[#FAFAFA]">
      {items.map((item, index) => (
        <DomainCollapsible
          key={index}
          icon={item.icon}
          title={item.title}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
          content={item.content}
        />
      ))}
    </div>
  );
}

interface IconWrapperProps {
  children: React.ReactNode;
  backColor: string;
}

function IconWrapper({ children, backColor }: IconWrapperProps) {
  return (
    <div
      className="flex items-center justify-center rounded-full w-8 h-8"
      style={{ backgroundColor: `${backColor}` }}
    >
      {children}
    </div>
  );
}
