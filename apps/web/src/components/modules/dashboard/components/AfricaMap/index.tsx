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
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";
import MetricsCard, { MetricsCardSkeleton } from "../MetricsCard";
import { useRouter } from "next/navigation";

export interface Country {
  name: string;
  countryCode: string;
  subregion: string;
  averageRate: number;
  center: [number, number];
}

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

type Region = (typeof regionOptions)[number];
type MeasurementScale = AssessmentMeasurementScale;

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
  const [selectedScale, setSelectedScale] = useState<MeasurementScale>();

  const router = useRouter();

  const { data: measurementScales, ...measurementScalesState } = useFindAll<{
    data: AssessmentMeasurementScale[];
  }>({
    path: "/dashboard/measurement-scales",
    queries: { sorts: { ascending: "rate" } },
  });

  const { data: countryStatuses } = useFindAll<Country[]>({
    path: `/dashboard/domains/average-rate/country`,
    isProtected: false,
  });

  const fetchedAssessmentData = useMemo(() => {
    const statusLookup = new Map(
      (countryStatuses as unknown as Country[])?.map((item) => [
        item.countryCode,
        item.averageRate,
      ])
    );

    const result: Record<
      string,
      { averageRate: number; color: string; scaleName: string }
    > = {};
    Object.entries(africanCountries).forEach(([code, name]) => {
      const averageRate = statusLookup.get(code) || 0;
      const scale = (
        measurementScales?.data as unknown as AssessmentMeasurementScale[]
      )?.find((s) => averageRate === s.rate);
      result[name] = {
        averageRate,
        color: scale ? scale.color : "#DDD",
        scaleName: scale ? scale.name : "No data",
      };
    });

    return result;
  }, [countryStatuses, measurementScales]);

  const getColor = (name: string, region: string) => {
    if (fetchedAssessmentData[name]) {
      if (selectedRegion) {
        const formattedRegion = `${selectedRegion.id} Africa`;
        if (region !== formattedRegion) {
          return "#EEEEEE";
        }
      }
      if (selectedScale) {
        return fetchedAssessmentData[name].scaleName === selectedScale.name
          ? fetchedAssessmentData[name].color
          : "#DDD";
      }
    }
    return fetchedAssessmentData[name]?.color || "#DDD";
  };

  const handleSelect = (value?: string) => {
    const selected = mapCountries.find((c) => c.name === value);

    if (selected) {
      setPosition({
        coordinates: selected.center!,
        zoom: 12,
      });
      setSelectedCountry(selected);
    }else{
      setPosition({  
        coordinates: [0, 0],
        zoom: 3,
      })
      setSelectedCountry(undefined);
    }
  };

  const onRegionSelectHandler = (v: Region | undefined) => {
    setSelectedRegion(v);
  };

  const onScaleSelectHandler = (v: MeasurementScale | undefined) => {
    setSelectedScale(v);
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

  const onCountryClickHandler = (countryCode?: string) => {
    if (countryCode) {
      router.push(`/dashboard/country/${countryCode}`);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const processed = africa.features.map((feature: any) => {
      const name = feature.properties.name;
      const center = geoCentroid(feature);
      return { name, center } as Partial<Country>;
    });

    setMapCountries(processed ?? []);
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
          maxZoom={50}
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
                            onClick={() =>
                              onCountryClickHandler(geo.properties.postal)
                            }
                            key={geo.rsmKey}
                            geography={geo}
                            fill={getColor(
                              geo.properties.name,
                              geo.properties.subregion
                            )}
                            stroke="#FFF"
                            strokeWidth={0.4}
                          />
                        }
                        content={`${geo.properties.name}: ${fetchedAssessmentData[geo.properties.name]?.scaleName || "No data"}`}
                      />
                    ))}

                  {selectedGeo && (
                    <Tooltip
                      color="dark"
                      trigger={
                        <Geography
                          onClick={() =>
                            onCountryClickHandler(selectedGeo.properties.postal)
                          }
                          key={selectedGeo.rsmKey}
                          geography={selectedGeo}
                          fill={getColor(
                            selectedGeo.properties.name,
                            selectedGeo.properties.subregion
                          )}
                          stroke="#ffff00"
                          strokeWidth={0.4}
                          style={{
                            default: {
                              outline: "none",
                              strokeDasharray: "0.3 0.3",
                            },
                          }}
                        />
                      }
                      content={`${selectedGeo.properties.name}: ${fetchedAssessmentData[selectedGeo.properties.name]?.scaleName || "No data"}`}
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
              <div className="rounded-md relative">
        <Select<Partial<Country>>
          options={mapCountries}
          onSelect={(c) => handleSelect(c?.name)}
          labelKey="name"
          valueKey="name"
          value={selectedCountry}
          placeholder="Select by Country"
        />
        {selectedCountry && (
            <div className="bg-white rounded-full absolute -top-2 -right-2 w-4 h-4">
              <Icon
                icon="carbon:close-filled"
                className="w-4 h-4 cursor-pointer text-destructive"
                onClick={() => {
                  setSelectedCountry(undefined);
                  onResetZoomHandler();
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-64 mb-4 absolute top-24 xl:top-10 right-80 left-10 xl:left-auto z-20 flex gap-4">
         <div className="rounded-md relative min-w-[247px] w-full">
        <Select<Region>
          options={regionOptions}
          onSelect={(r) => onRegionSelectHandler(r)}
          labelKey="name"
          valueKey="name"
          value={selectedRegion}
          placeholder="Filter by Regional Centers"
        />
        {selectedRegion && (
            <div className="bg-white rounded-full absolute -top-2 -right-2 w-4 h-4">
              <Icon
                icon="carbon:close-filled"
                className="w-4 h-4 cursor-pointer text-destructive"
                onClick={() => setSelectedRegion(undefined)}
              />
            </div>
          )}
        </div>
         <div className="rounded-md relative min-w-[147px] w-full">
        <Select<MeasurementScale>
          options={
            (measurementScales?.data as unknown as AssessmentMeasurementScale[]) ??
            []
          }
          onSelect={(s) => onScaleSelectHandler(s)}
          labelKey="name"
          valueKey="name"
          value={selectedScale}
          placeholder="Filter by Scale"
        />
         {selectedScale && (
            <div className="bg-white rounded-full absolute -top-2 -right-2 w-4 h-4">
              <Icon
                icon="carbon:close-filled"
                className="w-4 h-4 cursor-pointer text-destructive"
                onClick={() => setSelectedScale(undefined)}
              />
            </div>
          )}
        </div>
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
        {!measurementScalesState.isLoading &&
          (
            measurementScales?.data as unknown as AssessmentMeasurementScale[]
          )?.map((mScale, index) => (
            <MetricsCard
              key={index}
              name={mScale.name}
              color={mScale.color}
              rate={mScale.rate}
              legend
            />
          ))}
        <MetricsCard name="No data" color="#DDD" legend />
        {measurementScalesState.isLoading &&
          Array.from({ length: 5 }, (_, i) => <MetricsCardSkeleton key={i} />)}
      </div>
    </div>
  );
};
