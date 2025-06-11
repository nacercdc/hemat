"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Select } from "@etm/web-ui-components";

interface Props {
  countryOptions: { name: string }[];
  onDomainSelect: (value?: unknown) => void;

  onCountrySelect: (value?: unknown) => void;
}

export const FilterSection = ({
  countryOptions,
  onDomainSelect,
  onCountrySelect,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-9 bg-layout-bg/15 py-4 px-5 rounded-md w-full min-h-28">
      <div className="flex flex-col gap-2 sm:w-96">
        <div className="flex gap-3 items-center">
          <Icon icon="material-symbols-light:domain-rounded" />
          <span className="text-sm font-bold">Domains</span>
        </div>
        <Select<{ name: string }>
          placeholder="Leadership and governance"
          options={countryOptions}
          valueKey="name"
          labelKey="name"
          onSelect={onDomainSelect}
          size="lg"
        />
      </div>
      <div className="flex flex-col gap-2 sm:w-96">
        <div className="flex gap-3 items-center">
          <Icon icon="solar:map-linear" />
          <span className="text-sm font-bold">Country</span>
        </div>
        <Select<{ name: string }>
          placeholder="All"
          options={countryOptions}
          valueKey="name"
          labelKey="name"
          onSelect={onCountrySelect}
          size="lg"
        />
      </div>
    </div>
  );
};
