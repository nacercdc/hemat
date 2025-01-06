import baseConfig, { restrictEnvAccess } from "@e-market/eslint-config/base";
import nextjsConfig from "@e-market/eslint-config/nextjs";
import reactConfig from "@e-market/eslint-config/react";

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
