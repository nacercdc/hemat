"use client";
import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Annotation,
} from "react-simple-maps";
import { geoData } from "../constants/africa-map";
import { geoCentroid } from "d3-geo";

interface Metric {
  name: string;
  rate: number;
  color: string;
}

type CountryStatuses = Record<string, Metric>;

interface MapProps {
  /** Object mapping country names to their metric data including color */
  countryStatuses?: CountryStatuses;
  /** Callback function when a country is clicked */
  onCountryClick?: (countryName: string) => void;
  /** Width of the map container */
  width?: string | number;
  /** Height of the map container */
  height?: string | number;
  /** Custom CSS class for the container */
  className?: string;
  /** Map projection scale */
  scale?: number;
  /** Map center coordinates [longitude, latitude] */
  center?: [number, number];
  /** Initial zoom level */
  zoom?: number;
  /** Whether the map is interactive (clickable) */
  interactive?: boolean;
  /** Custom stroke color for country borders */
  strokeColor?: string;
  /** Stroke width for country borders */
  strokeWidth?: number;
  /** Whether to show hover effects */
  showHoverEffects?: boolean;
  /** Custom hover color */
  hoverColor?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
  /** Custom status colors override (optional, unused now) */
  customStatusColors?: Record<string, string>;
}

export const Map = ({
  width = "100%",
  height = "500px",
  className,
  scale = 300,
  center = [25, -15],
  zoom = 1,
  interactive = true,
  strokeColor = "#000",
  strokeWidth = 0.5,
  showHoverEffects = true,
  hoverColor = "#D1D5FF",
  isLoading = false,
  error = null,
  countryStatuses = {},
  onCountryClick,
}: MapProps) => {
  if (isLoading) {
    return (
      <div
        className={`bg-card shadow-lg rounded-lg p-4 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-basic-500">Loading map...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div
        className={`bg-card shadow-lg rounded-lg p-4 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-destructive-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-md overflow-hidden relative ${className}`}
      style={{ width, height, backgroundColor: "#AFBBC2" }}
    >
      <div className="w-full h-full overflow-hidden relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale,
            center,
          }}
        >
          <ZoomableGroup zoom={zoom}>
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const status = countryStatuses[countryName as string] || {
                    color: "#F3F4F6",
                  };
                  const fillColor = status.color;
                  const centroid = geoCentroid(geo);

                  return (
                    <React.Fragment key={geo.rsmKey}>
                      <Geography
                        geography={geo}
                        onClick={
                          interactive
                            ? () => onCountryClick?.(countryName)
                            : undefined
                        }
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        className={`
                          ${interactive ? "cursor-pointer" : "cursor-default"}
                          ${showHoverEffects && interactive ? "transition-colors" : ""}
                        `}
                        style={{
                          default: { outline: "none" },
                          hover:
                            showHoverEffects && interactive
                              ? {
                                  fill: hoverColor,
                                  outline: "none",
                                }
                              : { outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                      <Annotation
                        subject={centroid}
                        dx={0}
                        dy={0}
                        connectorProps={{
                          type: "authority",
                          stroke: "#000",
                          strokeWidth: 0.5,
                          strokeLinecap: "round",
                        }}
                        style={{ textAnchor: "middle" }}
                      >
                        <text
                          x={0}
                          y={0}
                          textAnchor="middle"
                          className="font-medium text-[6px] text-dark"
                        >
                          {countryName}
                        </text>
                      </Annotation>
                    </React.Fragment>
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
};
