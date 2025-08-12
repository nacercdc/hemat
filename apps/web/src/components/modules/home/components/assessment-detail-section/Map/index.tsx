/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { Select, Tooltip } from "@etm/web-ui-components";
import { cn } from "~/utils/cn.util";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import africa from "./africa.geo.json";
import africanCountries from "./africa-country-names.json";
import type { AssessmentStatus } from "~/libs/models/assessment-component.model";
interface Country {
  name: string;
  code: string;
  subregion: string;
  assessmentStatus:
    | "completed"
    | "closed"
    | "in_progress"
    | "ready"
    | "pending"
    | "draft";
  center: [number, number];
}

const colorMap: Record<AssessmentStatus, string> = {
  Completed: "#49B773",
  "In Progress": "#4E8EC9",
  Planned: "#EEDD6A",
  "Not Yet Assessed": "#ccc",
};

const regionOptions: {
  id: "Northern" | "Eastern" | "Western" | "Southern" | "Middle";
  name: string;
}[] = [
  { id: "Northern", name: "North" },
  { id: "Eastern", name: "East" },
  { id: "Western", name: "West" },
  { id: "Southern", name: "South" },
  { id: "Middle", name: "Central" },
];

const progressStatusOptions: {
  id: AssessmentStatus;
  name: AssessmentStatus;
}[] = [
  { id: "Completed", name: "Completed" },
  { id: "In Progress", name: "In Progress" },
  { id: "Not Yet Assessed", name: "Not Yet Assessed" },
  { id: "Planned", name: "Planned" },
];

//TODO: change as soon as api is changed
const statusMap = {
  completed: "Completed",
  draft: "Planned", //Needs review
  pending: "Planned", //Needs review
  ready: "Planned", //Needs review
  planned: "Planned",
  closed: "Completed", //Needs review
  in_progress: "In Progress", //Needs review
};

type ProgressStatus = (typeof progressStatusOptions)[number];
type Region = (typeof regionOptions)[number];

export const AfricaMap = () => {
  const [isMounted, setIsMounted] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [position, setPosition] = useState<{
    coordinates: [number, number];
    zoom: number;
  }>({
    coordinates: [0, 0],
    zoom: 3,
  });

  const [mapCountries, setMapCountries] = useState<Partial<Country>[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<Partial<Country>>();

  const [selectedRegion, setSelectedRegion] = useState<Region>();

  const [selectedStatus, setSelectedStatus] = useState<ProgressStatus>();

  const { data: countryStatuses } = useFindAll<Country[]>({
    path: `/dashboard/countries`,
    isProtected: false,
  });

  const fetchedAssessmentData = useMemo(() => {
    const statusLookup = new Map(
      (countryStatuses as unknown as Country[])?.map((item) => [
        item.code,
        item.assessmentStatus,
      ])
    );

    const result: Record<string, { progress: string; color: string }> = {};
    Object.entries(africanCountries).forEach(([code, name]) => {
      const apiStatus = statusLookup.get(code);

      const progress = apiStatus ? statusMap[apiStatus] : "Not Yet Assessed";

      result[name] = {
        progress: progress,
        color: colorMap[progress as AssessmentStatus],
      };
    });

    return result;
  }, [countryStatuses]);

  const getColor = (name: string, region: string) => {
    if (fetchedAssessmentData[name] && selectedRegion) {
      const formattedRegion = `${selectedRegion.id} Africa`;

      if (region !== formattedRegion) {
        return "#DDD";
      }
    }

    if (fetchedAssessmentData[name] && !selectedStatus) {
      return fetchedAssessmentData[name]?.color;
    }

    if (fetchedAssessmentData[name] && selectedStatus) {
      return selectedStatus.name === fetchedAssessmentData[name].progress
        ? fetchedAssessmentData[name]?.color
        : "#DDD";
    }
    return "#DDD";
  };

  const handleSelect = (value?: string) => {
    const selected = mapCountries.find((c) => c.name === value);

    if (selected) {
      setPosition({
        coordinates: selected.center!,
        zoom: 12,
      });
      setSelectedCountry(selected);
    } else {
      setPosition({
        coordinates: [0, 0],
        zoom: 3,
      });
      setSelectedCountry(undefined);
    }
  };

  const onStatusSelectHandler = (v: ProgressStatus | undefined) => {
    setSelectedStatus(v);
  };

  const onRegionSelectHandler = (v: Region | undefined) => {
    setSelectedRegion(v);
  };

  const onZoomInHandler = () => {
    if (position.zoom >= 10) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const onZoomOutHandler = () => {
    if (position.zoom <= 2) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const onMoveEndHandler = (
    pos: React.SetStateAction<{ coordinates: [number, number]; zoom: number }>
  ) => {
    setPosition(pos);
    setIsDragging(false);
  };

  const onResetZoomHandler = () => {
    setPosition({
      coordinates: [0, 0],
      zoom: 3,
    });
  };

  useEffect(() => {
    setIsMounted(true);

    const processed = africa.features.map((feature: any) => {
      const name = feature.properties.name;
      const center = geoCentroid(feature);
      return { name, center } as Partial<Country>;
    });

    setMapCountries(processed);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      id="map"
      className="relative h-[600px] overflow-x-auto"
      style={{
        backgroundImage: "radial-gradient(circle, #fff, #FAF5D450)",
      }}
    >
      <ComposableMap
        projection="geoMercator"
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        className={cn(
          "w-full h-full",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveStart={() => setIsDragging(true)}
          onMoveEnd={onMoveEndHandler}
          minZoom={3}
          maxZoom={10}
        >
          <Geographies geography={africa}>
            {({ geographies }) => {
              const selectedGeo = geographies.find(
                (geo) => geo.properties.name === selectedCountry?.name
              );

              return (
                <>
                  {geographies
                    .filter(
                      (geo) => geo.properties.name !== selectedCountry?.name
                    )
                    .map((geo, index) => (
                      <Tooltip
                        key={index}
                        color="dark"
                        trigger={
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={getColor(
                              geo.properties.name,
                              geo.properties.subregion
                            )}
                            stroke="#FFF"
                          />
                        }
                        content={geo.properties.name}
                      />
                    ))}

                  {selectedGeo && (
                    <Geography
                      key={selectedGeo.rsmKey}
                      geography={selectedGeo}
                      fill={getColor(
                        selectedGeo.properties.name,
                        selectedGeo.properties.subregion
                      )}
                      stroke="#ffff00"
                      strokeWidth={1}
                      style={{
                        default: {
                          outline: "none",
                          strokeDasharray: "4 2",
                        },
                      }}
                    />
                  )}
                </>
              );
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {/* Filter Section */}
      <div className="w-64 mb-4 absolute top-10 left-10 2xl:left-48 z-20">
        <Select<Partial<Country>>
          options={mapCountries}
          onSelect={(c) => handleSelect(c?.name)}
          labelKey="name"
          valueKey="name"
          value={selectedCountry}
          placeholder="Select by Country"
        />
      </div>
      <div className="w-64 mb-4 absolute top-24 xl:top-10 right-80 left-10 xl:left-auto z-20 flex gap-4">
        <Select<Region>
          options={regionOptions}
          onSelect={(r) => onRegionSelectHandler(r)}
          labelKey="name"
          valueKey="name"
          value={selectedRegion}
          placeholder="Filter by Regional Centers"
        />
        <Select<ProgressStatus>
          options={progressStatusOptions}
          onSelect={(s) => onStatusSelectHandler(s)}
          labelKey="id"
          valueKey="name"
          value={selectedStatus}
          placeholder="Filter by Status"
        />
      </div>
      {/* Controls Section */}
      <div className="flex flex-col absolute top-1/2 left-10 xl:left-auto xl:right-48 -translate-y-1/2 w-fit gap-2 z-20">
        <button
          onClick={onZoomInHandler}
          className="w-8 h-8 bg-white border-basic-300 border-[1px] flex justify-center items-center rounded-md"
        >
          <Icon icon="lucide:plus" />
        </button>
        <button
          onClick={onZoomOutHandler}
          className="w-8 h-8 bg-white border-basic-300 border-[1px] flex justify-center items-center rounded-md"
        >
          <Icon icon="lucide:minus" />
        </button>
        <button
          onClick={onResetZoomHandler}
          className="w-8 h-8 bg-white border-basic-300 border-[1px] flex justify-center items-center rounded-md"
        >
          <Icon icon="ion:refresh-outline" />
        </button>
      </div>
      {/* Legend Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 absolute left-10 2xl:left-48 bottom-20">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md"
            style={{ backgroundColor: `${colorMap.Completed}` }}
          ></div>
          <span className="text-sm font-bold">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md"
            style={{ backgroundColor: `${colorMap.Planned}` }}
          ></div>
          <span className="text-sm font-bold">Planned</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md"
            style={{ backgroundColor: `${colorMap["In Progress"]}` }}
          ></div>
          <span className="text-sm font-bold">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md"
            style={{ backgroundColor: `${colorMap["Not Yet Assessed"]}` }}
          ></div>
          <span className="text-sm font-bold">Not Yet Assessed</span>
        </div>
      </div>
    </div>
  );
};
