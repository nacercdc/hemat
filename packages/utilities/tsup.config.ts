import type { Options } from "tsup";
import { defineConfig } from "tsup";

import { createBaseTsupConfig } from "../../scripts/tsup-base";

const defaultConfig = (await createBaseTsupConfig({
  packageDir: __dirname,
})) as Options;
export default defineConfig([
  {
    ...defaultConfig,
    dts: true,
    bundle: true,
    entryPoints: ["./src/index.ts", "./src/**/*.{ts,tsx,js,jsx}"],
  },
]);
