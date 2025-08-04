"use client";

import { Tooltip } from "@etm/web-ui-components";
import { motion } from "framer-motion";
import { useState } from "react";
import { AssessedCountries } from "./AssessedCountries";
import { MeasurementScales } from "./MeasurementScales";

export function OverallStats() {
  const [isHovered, setIsHovered] = useState(false);

  const getTooltip = ({
    trigger,
    content,
    resultBg,
    result,
  }: {
    trigger: React.ReactNode;
    content: string;
    resultBg: string;
    result: number;
  }) => {
    return (
      <Tooltip
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
                : {
                    scale: 1,
                    opacity: [0.5, 0.3, 0.5],
                    rotate: 360,
                  }
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
              {getTooltip({
                content:
                  "Information and Communication Technologies (ICT) Infrastructure",
                result: 3,
                resultBg: "#FFFD02",
                trigger: (
                  <div className="absolute rounded-md w-8 h-6 bg-[#FFFD02] border-white/85 -top-[15px] left-0 right-0 mx-auto text-lg font-bold flex items-center justify-center text-dark z-20">
                    3
                  </div>
                ),
              })}
              {getTooltip({
                content: "Management and Workspace",
                result: 4,
                resultBg: "#00B0F0",
                trigger: (
                  <div className="absolute rounded-md w-8 h-6 bg-[#00B0F0] border-white/85 -bottom-[10px] left-0 right-0 mx-auto text-lg font-bold flex items-center justify-center text-white z-20">
                    4
                  </div>
                ),
              })}
            </div>
          </motion.div>
          <motion.div
            className={`absolute 2xl:w-[450px] 2xl:h-[450px] w-[400px] h-[400px] rounded-full border-2 border-primary/65 ${!isHovered ? "animate-pulse" : ""}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isHovered
                ? { scale: 1, opacity: 0.65 }
                : {
                    scale: 1,
                    opacity: [0.45, 0.25, 0.45],
                    rotate: -360,
                  }
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
              {getTooltip({
                content: "Leadership and Governance",
                result: 5,
                resultBg: "#11B050",
                trigger: (
                  <div className="absolute rounded-md w-8 h-6 bg-[#11B050] border-white/85 top-[30%] -left-[8px] text-lg font-bold flex items-center justify-center text-dark z-20">
                    5
                  </div>
                ),
              })}
            </div>
          </motion.div>
          <motion.div
            className={`absolute w-[300px] h-[300px] rounded-full border-2 border-primary/55 ${!isHovered ? "animate-pulse" : ""}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isHovered
                ? { scale: 1, opacity: 0.55 }
                : {
                    scale: 1,
                    opacity: [0.4, 0.2, 0.4],
                    rotate: 360,
                  }
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
              {getTooltip({
                content: "Standards and Interoperability",
                result: 2,
                resultBg: "#FFC000",
                trigger: (
                  <div className="absolute rounded-md w-8 h-6 bg-[#FFC000] border-white/85 top-[50%] -right-[10px] text-lg font-bold flex items-center justify-center text-white z-20">
                    2
                  </div>
                ),
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
