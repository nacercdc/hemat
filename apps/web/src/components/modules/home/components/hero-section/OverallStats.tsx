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

const DOMAIN_COLORS = [
  "#FFFD02",
  "#00B0F0",
  "#11B050",
  "#FFC000",
  "#FF5733",
  "#C70039",
  "#900C3F",
  "#581845",
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

  const measurementScaleLoading =
    measurementScalesState.isLoading || measurementScalesState.isFetching;

  useEffect(() => {
    const domains = averageRatedDomains as unknown as AverageRatedDomain[];
    if (domains?.length) {
      const validDomains = domains.filter((domain) => domain.averageRate !== 0);

      const availableCirclesCount = 3;

      const newTooltipData = validDomains.map((domain) => ({
        domain,
        circleIndex: Math.floor(Math.random() * availableCirclesCount),
        angle: Math.random() * 360,
        color:
          (
            measurementScales?.data as unknown as AssessmentMeasurementScale[]
          )?.find((mScale) => mScale.rate === domain.averageRate)?.color || "",
      }));

      setTooltipData(newTooltipData);
    }
  }, [averageRatedDomains, measurementScales, measurementScales?.data]);

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

          <motion.div
            className={`absolute 2xl:w-[600px] 2xl:h-[600px] w-[500px] h-[500px] rounded-full border-2 border-primary/85 ${!isHovered ? "animate-pulse" : ""}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isHovered
                ? { scale: 1, opacity: 0.85 }
                : { scale: 1, opacity: [0.5, 0.3, 0.5], rotate: 360 }
            }
            transition={
              isHovered
                ? { scale: { duration: 0.5, ease: "easeOut" } }
                : {
                    scale: { duration: 0.5, ease: "easeOut" },
                    opacity: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    },
                    rotate: {
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.5,
                    },
                  }
            }
          >
            <div className="2xl:w-[600px] 2xl:h-[600px] h-[500px] w-[500px] rounded-full relative">
              {tooltipData
                .filter((data) => data.circleIndex === 0)
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
                        className={`rounded-md w-8 h-6 border-white/85 text-lg font-bold flex items-center justify-center z-20 ${getContrastColor(color)}`}
                      >
                        {result}
                      </div>
                    ),
                  });
                })}
            </div>
          </motion.div>

          <motion.div
            className={`absolute 2xl:w-[450px] 2xl:h-[450px] w-[400px] h-[400px] rounded-full border-2 border-primary/65 ${!isHovered ? "animate-pulse" : ""}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isHovered
                ? { scale: 1, opacity: 0.65 }
                : { scale: 1, opacity: [0.45, 0.25, 0.45], rotate: -360 }
            }
            transition={
              isHovered
                ? { scale: { duration: 0.5, ease: "easeOut" } }
                : {
                    scale: { duration: 0.5, ease: "easeOut", delay: 0.5 },
                    opacity: {
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    },
                    rotate: {
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 1,
                    },
                  }
            }
          >
            <div className="2xl:w-[450px] 2xl:h-[450px] w-[400px] h-[400px] rounded-full relative">
              {tooltipData
                .filter((data) => data.circleIndex === 1)
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
                        className={`rounded-md w-8 h-6 border-white/85 text-lg font-bold flex items-center justify-center z-20 ${getContrastColor(color)}`}
                      >
                        {result}
                      </div>
                    ),
                  });
                })}
            </div>
          </motion.div>

          <motion.div
            className={`absolute w-[300px] h-[300px] rounded-full border-2 border-primary/55 ${!isHovered ? "animate-pulse" : ""}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isHovered
                ? { scale: 1, opacity: 0.55 }
                : { scale: 1, opacity: [0.4, 0.2, 0.4], rotate: 360 }
            }
            transition={
              isHovered
                ? { scale: { duration: 0.5, ease: "easeOut" } }
                : {
                    scale: { duration: 0.5, ease: "easeOut", delay: 1 },
                    opacity: {
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5,
                    },
                    rotate: {
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 1.5,
                    },
                  }
            }
          >
            <div className="w-[300px] h-[300px] rounded-full relative">
              {tooltipData
                .filter((data) => data.circleIndex === 2)
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
                        className={`rounded-md w-8 h-6 border-white/85 text-lg font-bold flex items-center justify-center z-20 ${getContrastColor(color)}`}
                      >
                        {result}
                      </div>
                    ),
                  });
                })}
            </div>
          </motion.div>

          <motion.div
            className={`absolute w-[175px] h-[175px] rounded-full border-2 border-primary/45 ${!isHovered ? "animate-pulse" : ""}`}
            initial={{ scale: 0, opacity: 1 }}
            animate={isHovered ? { scale: 1, opacity: 0.45 } : { scale: 1 }}
            transition={
              isHovered
                ? { scale: { duration: 0.5, ease: "easeOut" } }
                : {
                    scale: {
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 1.5,
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

          <div className="absolute rounded-full border-2 border-slate-200/10 animate-pulse 2xl:w-[450px] 2xl:h-[450px] w-[400px] h-[400px]">
            <div className="absolute w-6 h-6 bg-slate-200/10 rounded-md top-1/2 -translate-y-1/2 left-4 animate-pulse" />
          </div>

          <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-slate-200/10 animate-pulse">
            <div className="absolute w-6 h-6 bg-slate-200/10 rounded-md top-1/2 -translate-y-1/2 right-4 animate-pulse" />
          </div>

          <div className="absolute w-[175px] h-[175px] rounded-full border-2 bg-slate-200/5 border-slate-200/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
