"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import africa from "./africa.geo.json";
import { Button, Select, Tooltip } from "@etm/web-ui-components";
import { SelectGroup } from "@etm/web-ui-components/shadcn-ui/select";
import { cn } from "~/utils/cn.util";
import { AssessmentStatus } from "~/libs/models/assessment-component.model";

interface Country {
  name: string;
  center: [number, number];
}

const colorMap: Record<string, string> = {
  Ethiopia: "#ff00ff",
};

// TODO: Replace with real API call
const fetchedAssessmentData: Record<
  string,
  { progress: AssessmentStatus; color: string }
> = {
  Ethiopia: { progress: "Completed", color: "#49B773" },
  Egypt: { progress: "Completed", color: "#49B773" },
  Kenya: { progress: "In Progress", color: "#4E8EC9" },
  Chad: { progress: "Planned", color: "#EEDD6A" },
  Sudan: { progress: "Planned", color: "#EEDD6A" },
  "South Africa": { progress: "Not Yet Assessed", color: "#FF0101" },
};

export const Map = () => {
  const [isMounted, setIsMounted] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [position, setPosition] = useState<{
    coordinates: [number, number];
    zoom: number;
  }>({
    coordinates: [0, 0],
    zoom: 2,
  });

  const [countries, setCountries] = useState<Country[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<Country>();

  const getColor = (name: string) => {
    if (fetchedAssessmentData[name]) {
      return fetchedAssessmentData[name]?.color;
    }
    return "#DDD";
  };

  const handleSelect = (value?: string) => {
    const selected = countries.find((c) => c.name === value);

    if (selected) {
      setPosition({
        coordinates: selected.center,
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

  const handleZoomIn = () => {
    if (position.zoom >= 10) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 2) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleMoveEnd = (pos) => {
    setPosition(pos);
    setIsDragging(false);
  };

  useEffect(() => {
    setIsMounted(true);

    const processed = africa.features.map((feature: any) => {
      const name = feature.properties.name;
      const center = geoCentroid(feature);
      return { name, center } as Country;
    });

    setCountries(processed);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative h-[600px]">
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
          onMoveEnd={handleMoveEnd}
          minZoom={2}
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
                    .map((geo) => (
                      <Tooltip
                        color="dark"
                        trigger={
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={getColor(geo.properties.name)}
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
                      fill={getColor(selectedGeo.properties.name)}
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
      <div className="w-64 mb-4 absolute top-10 left-10 z-20">
        <Select<Country>
          options={countries}
          onSelect={(c) => handleSelect(c?.name)}
          labelKey="name"
          valueKey="name"
          value={selectedCountry}
          placeholder="Select by Country"
        />
      </div>
      <div className="flex flex-col absolute top-1/2 left-10 -translate-y-1/2 w-fit gap-2 z-20">
        <Button onClick={handleZoomIn} variant={"outline"}>
          <Icon icon="lucide:plus" />
        </Button>
        <Button onClick={handleZoomOut} variant={"outline"}>
          <Icon icon="lucide:minus" />
        </Button>
      </div>
    </div>
  );
};
