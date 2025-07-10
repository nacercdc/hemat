"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface Props {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
}

export const AnimatedCounter = ({
  from = 0,
  to,
  duration = 2,
  delay = 0,
}: Props) => {
  const count = useMotionValue(from);
  const nodeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const controls = animate(count, to, {
              duration,
              delay,
              onUpdate(value) {
                node.textContent = Math.round(value).toString();
              },
            });
            return () => controls.stop();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [count, to, duration, delay]);

  return <motion.span ref={nodeRef} />;
};
