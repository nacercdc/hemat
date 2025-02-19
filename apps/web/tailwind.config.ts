import type { Config } from "tailwindcss";
import baseConfig from "@etm/tailwind-config/web";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [...baseConfig.content, "../../packages/web-ui-components/src/**/*.{ts,tsx}"],
  presets: [baseConfig],
 
} satisfies Config;
