import type { Config } from "tailwindcss";
import baseConfig from "@e-market/tailwind-config/web";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/web-ui-components/src/**/*.{ts,tsx}"],
  presets: [baseConfig],
 
} satisfies Config;
