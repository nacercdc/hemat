import { Domain } from "~/libs/models/domain.model";
import { DomainScore } from "../components/assessment-detail-section/DomainCardList";
import { Icon } from "@iconify/react";
import { CollapsibleItem } from "../components/assessment-detail-section/DomainCollapsibleList";

export const PartnersImages = [
  {
    src: "/images/partners/afenet.svg",
    width: 800,
    height: 600,
    alt: "cdc logo",
  },
  {
    src: "/images/partners/africa_public_health.svg",
    width: 800,
    height: 600,
    alt: "africa public health logo",
  },
  {
    src: "/images/partners/african_dev_fund.svg",
    width: 800,
    height: 600,
    alt: "african dev fund logo",
  },
  {
    src: "/images/partners/cdc.svg",
    width: 800,
    height: 600,
    alt: "cdc logo",
  },
  {
    src: "/images/partners/global_fund.svg",
    width: 800,
    height: 600,
    alt: "global fund logo",
  },
  {
    src: "/images/partners/jica.svg",
    width: 800,
    height: 600,
    alt: "jica logo",
  },
  {
    src: "/images/partners/london_school_of_hygiene.svg",
    width: 800,
    height: 600,
    alt: "london school of hygiene logo",
  },
  {
    src: "/images/partners/public_health_england.svg",
    width: 800,
    height: 600,
    alt: "public health england logo",
  },
  {
    src: "/images/partners/ukaid.svg",
    width: 800,
    height: 600,
    alt: "ukaid logo",
  },
  {
    src: "/images/partners/unaids.svg",
    width: 800,
    height: 600,
    alt: "unaids logo",
  },
  {
    src: "/images/partners/usaid.svg",
    width: 800,
    height: 600,
    alt: "usaid logo",
  },
  {
    src: "/images/partners/who.svg",
    width: 800,
    height: 600,
    alt: "who logo",
  },
  {
    src: "/images/partners/world_bank.svg",
    width: 800,
    height: 600,
    alt: "world bank logo",
  },
];

//Dummy Domains Data
export const Domains: Domain[] = [
  {
    id: "1",
    name: "Leadership and Governance",
    code: "code_1",
    description: "Leadership and Governance",
    translations: {},
  },
  {
    id: "2",
    name: "Information and Communication Technology (ICT) Infrastructure",
    code: "code_2",
    description:
      "Information and Communication Technology (ICT) Infrastructure",
    translations: {},
  },
  {
    id: "3",
    name: "Standards and Interoperability",
    code: "code_3",
    description: "Standards and Interoperability",
    translations: {},
  },
  {
    id: "4",
    name: "Management and Workspace",
    code: "code_4",
    description: "Management and Workspace",
    translations: {},
  },
];

//Dummy domain scores data
export const domainScores: DomainScore[] = [
  { name: "OverAll", result: 3, type: "summary" },
  {
    name: "Leadership and Governance",
    result: 4,
    type: "single",
    icon: <Icon icon="fluent-mdl2:party-leader" />,
  },
  {
    name: "Information and Communication Technology (ICT) Infrastructure",
    result: 2,
    type: "single",
    icon: <Icon icon="game-icons:satellite-communication" />,
  },
  {
    name: "Standards and Interoperability",
    result: 5,
    type: "single",
    icon: <Icon icon="carbon:ibm-knowledge-catalog-standard" />,
  },
  {
    name: "Management and Workspace",
    result: 3,
    type: "single",
    icon: <Icon icon="fluent-mdl2:workforce-management" />,
  },
];

//Dummy data for domain score detail
export const collapsibleItems: CollapsibleItem[] = [
  {
    icon: <Icon icon="maki:communications-tower" />,
    color: "#FFC00024",
    title: Domains[0]?.name!,
    domain: Domains[0]!,
    content: [
      {
        title: "HIE Strategic Plan",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "Business Continuity Plan (BCP)",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "Policy and Standards Compliance Enforcement",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="carbon:ibm-knowledge-catalog-standard" />,
    color: "#348F4124",
    title: Domains[1]?.name!,
    domain: Domains[1]!,
    content: [
      {
        title: "HIE Strategic Plan",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "Business Continuity Plan (BCP)",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "Policy and Standards Compliance Enforcement",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="fluent-mdl2:workforce-management" />,
    color: "#FFFD0224",
    title: Domains[2]?.name!,
    domain: Domains[2]!,
    content: [
      {
        title: "HIE Strategic Plan",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "Business Continuity Plan (BCP)",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "Policy and Standards Compliance Enforcement",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="fluent-mdl2:workforce-management" />,
    color: "#FFFD0224",
    title: Domains[3]?.name!,
    domain: Domains[3]!,
    content: [
      {
        title: "HIE Strategic Plan",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "Business Continuity Plan (BCP)",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
      {
        title: "Policy and Standards Compliance Enforcement",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fringilla, libero non iaculis luctus, dui orci suscipit sem, id auctor ex lectus ut neque. Mauris tincidunt tortor in dui imperdiet, sed tempor libero laoreet. Quisque id nulla eu ipsum hendrerit vestibulum. Aliquam quis volutpat elit.",
        score: 4,
      },
    ],
  },
];
