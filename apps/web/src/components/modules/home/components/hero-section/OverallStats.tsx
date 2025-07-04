"use client";

import { motion } from "framer-motion";

export function OverallStats() {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col justify-between items-center gap-4 relative">
        <div className="relative flex items-center justify-center w-[600px] h-[600px]">
          <div className="w-[800px] h-[600px] bg-gradient-to-b from-transparent to-yellow-300/25 rounded-full absolute -bottom-0 -right-[450px] blur-3xl" />
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full border-2 border-primary/85 animate-pulse"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: [0.5, 0.3, 0.5],
              rotate: 360,
            }}
            transition={{
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
            }}
          >
            <div className="w-[600px] h-[600px] rounded-full relative">
              <div className="absolute rounded-md w-[40px] h-[30px] bg-[#FFFD02] border-white/85 -top-[15px] left-0 right-0 mx-auto text-lg font-bold flex items-center justify-center text-dark z-20">
                3
              </div>
              <div className="absolute rounded-md w-[40px] h-[30px] bg-[#00B0F0] border-white/85 -bottom-[15px] left-0 right-0 mx-auto text-lg font-bold flex items-center justify-center text-white z-20">
                4
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute w-[450px] h-[450px] rounded-full border-2 border-primary/65  animate-pulse"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: [0.45, 0.25, 0.45],
              rotate: -360,
            }}
            transition={{
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
            }}
          >
            <div className="w-[450px] h-[450px] rounded-full relative">
              <div className="absolute rounded-md w-[40px] h-[30px] bg-[#11B050] border-white/85 top-[30%] -left-[8px] text-lg font-bold flex items-center justify-center text-dark z-20">
                5
              </div>
              <div className="absolute rounded-md w-[40px] h-[30px] bg-[#FFC000] border-white/85 top-[50%] -right-[10px] text-lg font-bold flex items-center justify-center text-white z-20">
                5
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full border-2 border-primary/55 animate-pulse"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: [0.4, 0.2, 0.4],
              rotate: 360,
            }}
            transition={{
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
            }}
          >
            <div className="w-[300px] h-[300px] rounded-full relative">
              <div className="absolute rounded-md w-[40px] h-[30px] bg-[#11B050] border-white/85 top-[30%] -left-[8px] text-lg font-bold flex items-center justify-center text-dark z-20">
                5
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute w-[150px] h-[150px] rounded-full border-2 border-primary/45 animate-pulse"
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: 1,
            }}
            transition={{
              scale: { duration: 0.5, ease: "easeOut", delay: 1.5, repeat: 0 },
            }}
          >
            <div className="flex flex-col justify-center items-center gap-2 p-2">
              <span className="text-5xl text-[#E8D8A6] font-bold">32</span>
              <span className="rounded-md text-xs text-center text-white bg-[#E8D8A6]/25 p-1">
                Countries
              </span>
              <span className="text-xs text-white text-wrap text-center">
                Assessment <br />
                Collected
              </span>
            </div>
          </motion.div>
        </div>
        <div className="flex gap-2">
          <div className="text-white w-8 h-6 rounded-sm font-semibold bg-[#FF0101] text-center">
            1
          </div>
          <div className="text-dark w-8 h-6 rounded-sm font-semibold bg-[#FFC000] text-center">
            2
          </div>
          <div className="text-dark w-8 h-6 rounded-sm font-semibold bg-[#FFFD02] text-center">
            3
          </div>
          <div className="text-white w-8 h-6 rounded-sm font-semibold bg-[#00B0F0] text-center">
            4
          </div>
          <div className="text-white w-8 h-6 rounded-sm font-semibold bg-[#11B050] text-center">
            5
          </div>
        </div>
      </div>
    </div>
  );
}
