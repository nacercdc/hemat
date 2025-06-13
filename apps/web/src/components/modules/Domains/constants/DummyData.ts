import type { Domain } from "~/libs/models/domain.model";
import type { SubComponent } from "..";
import type { Component } from "~/libs/models/component.model";

//Temporary dummy Domains to be deleted
export const domains: Domain[] = [
  {
    id: "domain_1",
    name: "Domain-1",
    code: "Doamin-1-Code",
    description: "Domain-1-Description",
    translations: {
      en: {
        name: "Domain-1",
        description: "Domain-1-Description",
      },
      fr: {
        name: "Domain-1",
        description: "Domain-1-Description",
      },
    },
  },
  {
    id: "domain_2",
    name: "Domain-2",
    code: "Doamin-2-Code",
    description: "Domain-2-Description",
    translations: {
      en: {
        name: "Domain-2",
        description: "Domain-2-Description",
      },
      fr: {
        name: "Domain-2",
        description: "Domain-2-Description",
      },
    },
  },
  {
    id: "domain_3",
    name: "Domain-3",
    code: "Doamin-3-Code",
    description: "Domain-3-Description",
    translations: {
      en: {
        name: "Domain-3",
        description: "Domain-3-Description",
      },
      fr: {
        name: "Domain-3",
        description: "Domain-3-Description",
      },
    },
  },
];

//Temporary dummy Components
export const components: Component[] = [
  {
    id: "component_1",
    name: "Component-1",
    code: "Doamin-1-Code",
    description: "Component-1-Description",
    domainId: "domain_1",
    translations: {
      en: {
        name: "Component-1",
        description: "Component-1-Description",
      },
      fr: {
        name: "Component-1",
        description: "Component-1-Description",
      },
    },
  },
  {
    id: "component_2",
    name: "Component-2",
    code: "Doamin-2-Code",
    description: "Component-2-Description",
    domainId: "domain_2",
    translations: {
      en: {
        name: "Component-2",
        description: "Component-2-Description",
      },
      fr: {
        name: "Component-2",
        description: "Component-2-Description",
      },
    },
  },
  {
    id: "component_3",
    name: "Component-3",
    code: "Doamin-3-Code",
    description: "Component-3-Description",
    domainId: "domain_3",
    translations: {
      en: {
        name: "Component-3",
        description: "Component-3-Description",
      },
      fr: {
        name: "Component-3",
        description: "Component-3-Description",
      },
    },
  },
];

//Temporary dummy Sub-Components
export const subComponents: SubComponent[] = [
  {
    id: "component_1",
    name: "Sub-Component-1",
    code: "Doamin-1-Code",
    description: "Component-1-Description",
    componentId: "component_1",
    translations: {
      en: {
        name: "Sub-Component-1",
        description: "Sub-Component-1-Description",
      },
      fr: {
        name: "Sub-Component-1",
        description: "Sub-Component-1-Description",
      },
    },
  },
  {
    id: "component_2",
    name: "Sub-Component-2",
    code: "Sub-Doamin-2-Code",
    description: "Component-2-Description",
    componentId: "component_1",
    translations: {
      en: {
        name: "Sub-Component-2",
        description: "Sub-Component-2-Description",
      },
      fr: {
        name: "Sub-Component-2",
        description: "Sub-Component-2-Description",
      },
    },
  },
  {
    id: "component_3",
    name: "Sub-Component-3",
    code: "Doamin-3-Code",
    description: "Component-3-Description",
    componentId: "component_1",
    translations: {
      en: {
        name: "Sub-Component-3",
        description: "Sub-Component-3-Description",
      },
      fr: {
        name: "Sub-Component-3",
        description: "Sub-Component-3-Description",
      },
    },
  },
  {
    id: "component_4",
    name: "Sub-Component-4",
    code: "Doamin-4-Code",
    description: "Component-4-Description",
    componentId: "component_2",
    translations: {
      en: {
        name: "Sub-Component-4",
        description: "Sub-Component-4-Description",
      },
      fr: {
        name: "Sub-Component-4",
        description: "Sub-Component-4-Description",
      },
    },
  },
  {
    id: "component_5",
    name: "Sub-Component-5",
    code: "Doamin-5-Code",
    description: "Component-5-Description",
    componentId: "component_3",
    translations: {
      en: {
        name: "Sub-Component-5",
        description: "Sub-Component-5-Description",
      },
      fr: {
        name: "Sub-Component-5",
        description: "Sub-Component-5-Description",
      },
    },
  },
];
