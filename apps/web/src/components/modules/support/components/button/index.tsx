"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import HelpSupportWidget from "../popup";

export default function HelpSupportButton() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 flex flex-col items-center gap-1 z-50"
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-success-300"
            style={{ filter: "blur(12px)" }}
            animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 2.2,
              ease: "easeOut",
            }}
          />

          <div className="relative z-10 bg-white rounded-full p-4 shadow-md">
            <Icon
              icon="material-symbols-light:contact-support-outline-rounded"
              className="text-success w-7 h-7"
            />
          </div>
        </div>

        <span className="text-sm text-basic-800">Help & Support</span>
      </motion.button>
      {open && <HelpSupportWidget onClose={() => setOpen(false)} />}
    </>
  );
}
