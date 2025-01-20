// @ts-nocheck
import baseConfig, { restrictEnvAccess } from "@etm/eslint-config/base";
import nextjsConfig from "@etm/eslint-config/nextjs";
import reactConfig from "@etm/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
