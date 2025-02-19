import type { Config } from "tailwindcss";

import baseConfig from "@etm/tailwind-config/web";

export default {
  content: [...baseConfig.content],
  presets: [baseConfig],
} satisfies Config;
