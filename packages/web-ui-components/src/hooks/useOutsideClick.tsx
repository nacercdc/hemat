"use client";

import { useEffect } from "react";

export function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  handler?: (e: MouseEvent) => void,
  buttonRef?: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref?.current &&
        !ref.current.contains(event.target as Node) &&
        !buttonRef?.current?.contains(event.target as Node)
      ) {
        handler?.(event);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, buttonRef, handler]);
}
