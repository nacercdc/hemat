import path from "path";

import type { Options } from "tsup";

type CreateBaseTsupConfigOptions = {
  packageDir?: string;

  isProd?: boolean;
};

export async function createBaseTsupConfig(
  props: CreateBaseTsupConfigOptions
): Promise<Options> {
  const {
    packageDir = process.cwd(),
    isProd = process.env.NODE_ENV === "production",
  } = props;
  const pkg = (
    await import(path.join(packageDir, "package.json"), {
      with: { type: "json" },
    })
  ).default;
  const tsconfigContent = (
    await import(path.join(packageDir, "tsconfig.json"), {
      with: { type: "json" },
    })
  ).default;

  const { compilerOptions } = tsconfigContent;
  const { outDir } = compilerOptions;
  const peerDeps = pkg.peerDependencies
    ? Object.keys(pkg.peerDependencies)
    : [];

  return {
    entryPoints: ["./src/**/*.{ts,tsx,js,jsx}"],
    format: ["cjs", "esm"],
    dts: isProd,
    minify: false,
    outDir: "dist/",
    clean: true,
    sourcemap: !isProd,
    bundle: false,
    outExtension(ctx) {
      return {
        dts: ".d.ts",
        js: ctx.format === "cjs" ? ".cjs" : ".js",
      };
    },
    treeshake: false,
    target: "es2022",
    platform: "node",
    tsconfig: "./tsconfig.json",
    cjsInterop: true,
    keepNames: true,
    skipNodeModulesBundle: false,
    external: [...peerDeps],
    define: {
      PACKAGE_NAME: `"${pkg.name}"`,
      PACKAGE_VERSION: `"${pkg.version}"`,
      __DEV__: `${!isProd}`,
    },
  };
}
