import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily:{
        regular: "var(--font-family-regular)",
        thin: "var(--font-family-thin)",
        extraLight: "var(--font-family-extraLight)",
        light: "var(--font-family-light)",
        medium: "var(--font-family-medium)",
        bold: "var(--font-family-bold)",
        semiBold: "var(--font-family-semiBold)",
        extraBold: "var(--font-family-extraBold)"
      }
    },
  },
} satisfies Config;

