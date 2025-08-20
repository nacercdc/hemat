"use client";

import { Tooltip } from "@etm/web-ui-components";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AssessedCountries } from "./AssessedCountries";
import { MeasurementScales } from "./MeasurementScales";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { AverageRatedDomain } from "../assessment-detail-section/DomainCardList";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";

interface TooltipData {
  domain: AverageRatedDomain;
  circleIndex: number;
  angle: number;
  color: string;
}

interface CircleConfig {
  sizeClass: string;
  borderClass: string;
  hoveredOpacity: number;
  pulseOpacity: number[];
  durationOpacity: number;
  durationRotate: number;
  delayScale: number;
  delayAnim: number;
  rotate: number;
}

const circleConfigs: CircleConfig[] = [
  {
    sizeClass:
      "2xl:w-[600px] 2xl:h-[600px] md:w-[500px] md:h-[500px] w-[450px] h-[450px]",
    borderClass: "border-primary/85",
    hoveredOpacity: 0.85,
    pulseOpacity: [0.5, 0.3, 0.5],
    durationOpacity: 2,
    durationRotate: 20,
    delayScale: 0,
    delayAnim: 0.5,
    rotate: 360,
  },
  {
    sizeClass:
      "2xl:w-[520px] 2xl:h-[520px] md:w-[440px] md:h-[440px] w-[390px] h-[390px]",
    borderClass: "border-primary/75",
    hoveredOpacity: 0.75,
    pulseOpacity: [0.475, 0.275, 0.475],
    durationOpacity: 1.9,
    durationRotate: 18,
    delayScale: 0.25,
    delayAnim: 0.75,
    rotate: -360,
  },
  {
    sizeClass:
      "2xl:w-[440px] 2xl:h-[440px] md:w-[380px] md:h-[380px] w-[330px] h-[330px]",
    borderClass: "border-primary/65",
    hoveredOpacity: 0.65,
    pulseOpacity: [0.45, 0.25, 0.45],
    durationOpacity: 1.8,
    durationRotate: 15,
    delayScale: 0.5,
    delayAnim: 1,
    rotate: 360,
  },
  {
    sizeClass:
      "2xl:w-[360px] 2xl:h-[360px] md:w-[320px] md:h-[320px] w-[270px] h-[270px]",
    borderClass: "border-primary/55",
    hoveredOpacity: 0.55,
    pulseOpacity: [0.425, 0.225, 0.425],
    durationOpacity: 1.7,
    durationRotate: 13,
    delayScale: 0.75,
    delayAnim: 1.25,
    rotate: -360,
  },
  {
    sizeClass:
      "2xl:w-[280px] 2xl:h-[280px] md:w-[260px] md:h-[260px] w-[210px] h-[210px]",
    borderClass: "border-primary/45",
    hoveredOpacity: 0.45,
    pulseOpacity: [0.4, 0.2, 0.4],
    durationOpacity: 1.6,
    durationRotate: 10,
    delayScale: 1,
    delayAnim: 1.5,
    rotate: 360,
  },
];

const getContrastColor = (hex: string) => {
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? "text-dark" : "text-white";
};

const getTooltipStyle = (angle: number): React.CSSProperties => {
  const angleInRad = (angle * Math.PI) / 180;

  const left = 50 + 50 * Math.cos(angleInRad);
  const top = 50 - 50 * Math.sin(angleInRad);

  return {
    position: "absolute",
    left: `${left}%`,
    top: `${top}%`,

    transform: "translate(-50%, -50%)",
  };
};

export function OverallStats() {
  const [isHovered, setIsHovered] = useState(false);

  const [tooltipData, setTooltipData] = useState<TooltipData[]>([]);

  const { data: averageRatedDomains, ...averageRatedDomainsState } = useFindAll<
    AverageRatedDomain[]
  >({ path: `/dashboard/domains/average-rate`, isProtected: false });

  const { data: measurementScales, ...measurementScalesState } = useFindAll<{
    data: AssessmentMeasurementScale[];
  }>({
    path: `/dashboard/measurement-scales`,
    isProtected: false,
    queries: { sorts: { ascending: "rate" } },
  });

  const isLoading =
    averageRatedDomainsState.isLoading || averageRatedDomainsState.isFetching;

  const _measurementScaleLoading =
    measurementScalesState.isLoading || measurementScalesState.isFetching;

  useEffect(() => {
    const domains = averageRatedDomains as unknown as AverageRatedDomain[];
    if (domains?.length) {
      const validDomains = domains.filter((domain) => domain.averageRate !== 0);

      const newTooltipData = validDomains?.map((domain) => ({
        domain,
        circleIndex: 5 - Math.round(domain.averageRate),
        angle: Math.random() * 360,
        color:
          (
            measurementScales?.data as unknown as AssessmentMeasurementScale[]
          )?.find((mScale) => mScale.rate === Math.round(domain.averageRate))
            ?.color || "",
      }));

      setTooltipData(newTooltipData);
    }
  }, [averageRatedDomains, measurementScales]);

  const getTooltip = ({
    key,
    trigger,
    content,
    resultBg,
    result,
  }: {
    key: string;
    trigger: React.ReactNode;
    content: string;
    resultBg: string;
    result: number;
  }) => {
    return (
      <Tooltip
        key={key}
        color="dark"
        content={
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{content}</span>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 flex items-center justify-center text-dark rounded-md font-bold"
                style={{ backgroundColor: `${resultBg}` }}
              >
                <span className="w-fit">{result}</span>
              </div>
              <span className="text-xs">Africa Average</span>
            </div>
          </div>
        }
        trigger={trigger}
      />
    );
  };

  if (isLoading) return <OverallStatsSkeleton />;

  return (
    <div className="w-full flex justify-center -mt-10">
      <div className="flex flex-col justify-between items-center gap-4 relative">
        <div
          className="relative flex items-center justify-center w-[600px] h-[600px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-[800px] h-[600px] bg-gradient-to-b from-transparent to-yellow-300/25 rounded-full absolute -bottom-0 -right-[450px] blur-3xl" />

          {circleConfigs.map((config, index) => (
            <motion.div
              key={index}
              className={`absolute rounded-full border-2 ${config.borderClass} ${!isHovered ? "animate-pulse" : ""} ${config.sizeClass}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isHovered
                  ? { scale: 1, opacity: config.hoveredOpacity }
                  : {
                      scale: 1,
                      opacity: config.pulseOpacity,
                      rotate: config.rotate,
                    }
              }
              transition={
                isHovered
                  ? { scale: { duration: 0.5, ease: "easeOut" } }
                  : {
                      scale: {
                        duration: 0.5,
                        ease: "easeOut",
                        delay: config.delayScale,
                      },
                      opacity: {
                        duration: config.durationOpacity,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: config.delayAnim,
                      },
                      rotate: {
                        duration: config.durationRotate,
                        repeat: Infinity,
                        ease: "linear",
                        delay: config.delayAnim,
                      },
                    }
              }
            >
              <div className={`rounded-full relative ${config.sizeClass}`}>
                {tooltipData
                  .filter((data) => data.circleIndex === index)
                  .map(({ domain, angle, color }) => {
                    const result = Math.round(domain.averageRate);
                    return getTooltip({
                      key: domain.name,
                      content: domain.name,
                      result,
                      resultBg: color,
                      trigger: (
                        <div
                          style={{
                            ...getTooltipStyle(angle),
                            backgroundColor: color,
                          }}
                          className={`rounded-sm w-5 h-5 border-white/85 text-sm font-bold flex items-center justify-center z-20 ${getContrastColor(color)}`}
                        >
                          {result}
                        </div>
                      ),
                    });
                  })}
              </div>
            </motion.div>
          ))}

          <motion.div
            className={`absolute md:w-[175px] md:h-[175px] w-[150px] h-[150px] rounded-full border-2 border-primary/45 ${!isHovered ? "animate-pulse" : ""}`}
            initial={{ scale: 0, opacity: 1 }}
            animate={isHovered ? { scale: 1, opacity: 0.45 } : { scale: 1 }}
            transition={
              isHovered
                ? { scale: { duration: 0.5, ease: "easeOut" } }
                : {
                    scale: {
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 1.25,
                      repeat: 0,
                    },
                  }
            }
          >
            <AssessedCountries />
          </motion.div>
        </div>
        <MeasurementScales />
      </div>
    </div>
  );
}

function OverallStatsSkeleton() {
  return (
    <div className="w-full flex justify-center -mt-10">
      <div className="flex flex-col justify-between items-center gap-4 relative">
        <div className="relative flex items-center justify-center w-[600px] h-[600px]">
          <div className="absolute rounded-full border-2 border-slate-200/10 animate-pulse 2xl:w-[600px] 2xl:h-[600px] w-[500px] h-[500px]">
            <div className="absolute w-6 h-6 bg-slate-200/10 rounded-md top-4 left-1/2 -translate-x-1/2 animate-pulse" />
            <div className="absolute w-6 h-6 bg-slate-200/10 rounded-md bottom-4 left-1/2 -translate-x-1/2 animate-pulse" />
          </div>

          <div className="absolute rounded-full border-2 border-slate-200/10 animate-pulse 2xl:w-[520px] 2xl:h-[520px] w-[440px] h-[440px]">
            <div className="absolute w-6 h-6 bg-slate-200/10 rounded-md top-1/2 -translate-y-1/2 left-4 animate-pulse" />
          </div>

          <div className="absolute rounded-full border-2 border-slate-200/10 animate-pulse 2xl:w-[440px] 2xl:h-[440px] w-[380px] h-[380px]">
            <div className="absolute w-6 h-6 bg-slate-200/10 rounded-md top-1/2 -translate-y-1/2 right-4 animate-pulse" />
          </div>

          <div className="absolute rounded-full border-2 border-slate-200/10 animate-pulse 2xl:w-[360px] 2xl:h-[360px] w-[320px] h-[320px]">
            <div className="absolute w-6 h-6 bg-slate-200/10 rounded-md bottom-1/2 translate-y-1/2 left-1/4 animate-pulse" />
          </div>

          <div className="absolute rounded-full border-2 border-slate-200/10 animate-pulse 2xl:w-[280px] 2xl:h-[280px] w-[260px] h-[260px]">
            <div className="absolute w-6 h-6 bg-slate-200/10 rounded-md top-1/4 left-1/2 -translate-x-1/2 animate-pulse" />
          </div>

          <div className="absolute w-[175px] h-[175px] rounded-full border-2 bg-slate-200/5 border-slate-200/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
