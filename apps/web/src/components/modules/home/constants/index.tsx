/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Domain } from "~/libs/models/domain.model";
import type { DomainScore } from "../components/assessment-detail-section/DomainCardList";
import { Icon } from "@iconify/react";
import type { CollapsibleItem } from "../components/assessment-detail-section/DomainCollapsibleList";

export const PartnersImages = [
  {
    src: "/images/partners/afenet.svg",
    width: 100,
    height: 50,
    alt: "cdc logo",
  },
  {
    src: "/images/partners/africa_public_health.svg",
    width: 100,
    height: 1000,
    alt: "africa public health logo",
  },
  {
    src: "/images/partners/african_dev_fund.svg",
    width: 100,
    height: 50,
    alt: "african dev fund logo",
  },
  {
    src: "/images/partners/cdc.svg",
    width: 100,
    height: 70,
    alt: "cdc logo",
  },
  {
    src: "/images/partners/global_fund.svg",
    width: 200,
    height: 50,
    alt: "global fund logo",
  },
  {
    src: "/images/partners/jica.svg",
    width: 100,
    height: 50,
    alt: "jica logo",
  },
  {
    src: "/images/partners/london_school_of_hygiene.svg",
    width: 200,
    height: 50,
    alt: "london school of hygiene logo",
  },
  {
    src: "/images/partners/public_health_england.svg",
    width: 100,
    height: 50,
    alt: "public health england logo",
  },
  {
    src: "/images/partners/ukaid.svg",
    width: 100,
    height: 80,
    alt: "ukaid logo",
  },
  {
    src: "/images/partners/unaids.svg",
    width: 100,
    height: 120,
    alt: "unaids logo",
  },
  {
    src: "/images/partners/usaid.svg",
    width: 100,
    height: 50,
    alt: "usaid logo",
  },
  {
    src: "/images/partners/who.svg",
    width: 100,
    height: 100,
    alt: "who logo",
  },
  {
    src: "/images/partners/world_bank.svg",
    width: 100,
    height: 50,
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
    icon: <Icon icon="fluent-mdl2:party-leader" />,
    color: "#FFC00024",
    title: "HIE Strategy",
    domain: Domains[0]!,
    content: [
      {
        title: "HIE strategic plan",
        content:
          "An HIE strategic plan is one or set of documents (strategies, frameworks, and/or blue prints) that defines the vision for managing health information. Countries may have broader strategies for all Digital Health System (DHS) or specific HIE Strategy. The document must clearly include vision, strategies, and a robust M&E framework for the HIE.",
        score: 4,
      },
      {
        title: "M&E plan(s)",
        content:
          "A framework/roadmap for periodic monitoring and evaluation of the progresses and goals of HIE implementation.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="fluent-mdl2:party-leader" />,
    color: "#FFC00024",
    title: "Business Continuity",
    domain: Domains[0]!,
    content: [
      {
        title: "Business Continuity Plan (BCP)",
        content:
          "BCP is about devising plans and strategies that enable an organization to continue business operations of HIE and enable it to recover quickly and effectively from any type of disruption, whatever its size or cause.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="fluent-mdl2:party-leader" />,
    color: "#FFFD0224",
    title: "Policy, Legal, and Regulatory Frameworks, and Compliance",
    domain: Domains[0]!,
    content: [
      {
        title: "Existence of HIE policies and legislation",
        content:
          "Documented comprehensive framework for HIE that outlines a set of principles, guidelines, and norms to guide decisions and achieve outcomes.",
        score: 4,
      },
      {
        title: "Policy and standards compliance enforcement",
        content:
          "Specified mechanisms and regulatory body to ensure adherence to laws, policies, standards, and code of conduct related to HIE.",
        score: 4,
      },
      {
        title: "Data ethics",
        content:
          "Addresses the moral dimensions of data management, emphasizing adherence to ethical principles throughout the entire data lifecycle, including generation, recording, curation, processing, dissemination, sharing, and use. Key ethical practices aim to respect the individuals behind the data, ensure that data usage aligns with the intentions of the disclosing party, match privacy and security safeguards to individual expectations, and comply with laws governing health and health-related data privacy and security.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="fluent-mdl2:party-leader" />,
    color: "#FFFD0224",
    title:
      "HIE Leadership and Governance; Organizational Structures and Functions",
    domain: Domains[0]!,
    content: [
      {
        title: "HIE leadership and coordination",
        content:
          "The exercise of technical, political, and administrative authority to manage national HIE affairs at all levels of the health system. The governance structure consists of the mechanisms, processes, and institutions to oversee the functioning of HIE.",
        score: 4,
      },
      {
        title: "HIE organization structure and function",
        content:
          "Defined organizational structures and process, including job titles and clear descriptions of duties and responsibilities related to HIE.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="maki:communications-tower" />,
    color: "#FFFD0224",
    title: "Operations and Maintenance",
    domain: Domains[1]!,
    content: [
      {
        title: "Reliable power/electricity",
        content:
          "Reliable power supply for relevant offices as well as health facilities and institutions to enable the use of digital health systems for the facilitation of HIE.",
        score: 4,
      },
      {
        title: "ICT business infrastructure",
        content:
          "Infrastructure and systems that support the ICT operations, communications, and processes of HIE inclusive initiatives. It includes the physical hardware, software, networks, and services that enable the use ICT effectively.",
        score: 4,
      },
      {
        title: "Hardware",
        content:
          "An assembly of tangible physical parts of  computers, networks equipment and all peripherals which forms the foundation for implementing digital health systems and HIE  across services and geographic and health sectors boundaries. ",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="maki:communications-tower" />,
    color: "#FFFD0224",
    title: "Communication Network (LAN and WAN)",
    domain: Domains[1]!,
    content: [
      {
        title: "Networks and Internet connectivity",
        content:
          "Use of necessary equipment such as server, routers, switches, and gateways to connect network peripherals to one another and the Internet in order to enable the operation of Digital health systems and HIE.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="carbon:ibm-knowledge-catalog-standard" />,
    color: "#FFFD0224",
    title: "HIE Standards and Guidelines",
    domain: Domains[2]!,
    content: [
      {
        title: "HIE standard guidelines",
        content:
          "Standard guidelines to enable consistent and accurate definition, collection, and exchange of health data among digital health systems and services.",
        score: 4,
      },
      {
        title: "Dataset definitions (Clinical and Indicator)",
        content:
          "Common datasets such as those defining clinical care, community health, disease surveillance, etc are defined along with distinct data elements.",
        score: 4,
      },
      {
        title: "Data exchange standards",
        content:
          "A data exchange standard is adopted model for organizing electronic health data in a common format, such as XML, JSON so that a set of digital health systems (e.g., databases, applications, etc.) can share information with other systems. ",
        score: 4,
      },
      {
        title: "Data sharing",
        content:
          "A practice of making data/information available for use based on set standards and policies.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="carbon:ibm-knowledge-catalog-standard" />,
    color: "#FFFD0224",
    title: "HIE Core Services",
    domain: Domains[2]!,
    content: [
      {
        title: "Master Facility List (MFL)",
        content:
          "A Master Facility List (MFL) is a complete list of health facilities (both public and private) in a country and comprises of information that identifies each facility and service domain.",
        score: 4,
      },
      {
        title: "Indicator registry",
        content:
          "A centralized repository that maintains a comprehensive list of indicators.",
        score: 4,
      },
      {
        title: "Terminology management",
        content:
          "The process through which health terminologies are collected, managed, stored and used.",
        score: 4,
      },
      {
        title: "Unique person identity management ",
        content:
          "The process of creating and maintaining a unique identity of individuals across health systems.",
        score: 4,
      },
      {
        title: "National Enterprise Architecture",
        content:
          "A structured framework that aligns business processes and information technology (IT) systems with national digital health strategic objectives.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="carbon:ibm-knowledge-catalog-standard" />,
    color: "#FFFD0224",
    title: "Interoperability (Data Exchange)",
    domain: Domains[2]!,
    content: [
      {
        title: "Personal data exchange",
        content: "Standards-based patient data exchange among DHS.",
        score: 4,
      },
      {
        title: "Aggregate data exchange",
        content:
          "Standards-based exchange of aggregated and consolidated data between digital health systems.",
        score: 4,
      },
      {
        title: "Commodity data exchange",
        content:
          "Standards-based exchange of electronic data on healthcare commodities such as medical supplies and equipments etc.",
        score: 4,
      },
      {
        title: "Data exchange security",
        content:
          "Adherence to national policies, guidelines, standards, and applicable laws for HIE.",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="fluent-mdl2:workforce-management" />,
    color: "#FFFD0224",
    title: "HIE Workforce Capacity and Development",
    domain: Domains[3]!,
    content: [
      {
        title: "HIE competencies (knowledge, skills, and abilities)",
        content:
          "Availability of capable and adequate personnel to perform HIE tasks to achieve clearly defined outcomes.",
        score: 4,
      },
      {
        title: "Human resource capacity development",
        content:
          "Activities aimed at imparting knowledge and skills of HIE as well as shaping attitudes and developing specific competencies and capabilities of personnels.",
        score: 4,
      },
      {
        title: "HR strategy",
        content:
          "A strategic document designed to align workforce capabilitites with digital health initiatives and goals. ",
        score: 4,
      },
    ],
  },
  {
    icon: <Icon icon="fluent-mdl2:workforce-management" />,
    color: "#FFFD0224",
    title: "Financial Management",
    domain: Domains[3]!,
    content: [
      {
        title: "HIE financing plan",
        content:
          "A strategic document that outlines the financial framework and strategies necessary to support the establishment, operation, and sustainability of HIE inclusive initiatives. This plan details how funds will be sourced, allocated, and managed to ensure HIE implementation.",
        score: 4,
      },
      {
        title: "Financial resource mobilization",
        content:
          "All activities involved in securing the necessary financial resources for an organization. Mobilization efforts can be made from local, international, and other partners/stakeholders.",
        score: 4,
      },
    ],
  },
];
