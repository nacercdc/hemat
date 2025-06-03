import fs from "fs"
import path from "path"

export type PackageJson = {
  name: string
  version: string
  description: string
  peerDependencies?: Record<string, string>
  dependencies?: Record<string, string>
  exports?: Record<string, string | { require?: string; import?: string }>
}

export function makeDistPackageJson<T extends PackageJson>({ outDir, pkg, currentDir }: { outDir?: string; pkg: T; currentDir: string }) {
  outDir = outDir || "dist"
  const rootExports = pkg.exports || {}
  const distExports = Object.entries(rootExports).reduce<
    Record<
      string,
      {
        types: string
        import: string
        require: string
      }
    >
  >((acc, [specifier, target]: [string, string | { require?: string; import?: string }]) => {
    const rawPath = typeof target === "string" ? target : (target.require ?? target.import ?? Object.values(target)[0])
    if (!rawPath) throw new Error(`Invalid export target for ${specifier}: ${target}`)

    let rel = rawPath
      .replace(/^\.\//, "")
      .replace(/^src\//, "")
      .replace(/\.[jt]sx?$/, "")

    acc[specifier] = {
      types: `./${rel}.d.ts`,
      import: `./${rel}.js`,
      require: `./${rel}.cjs`,
    }
    return acc
  }, {})

  const entry = distExports["."] || {
    require: "./main.cjs",
    import: "./main.mjs",
    types: "./main.d.ts",
  }

  const distPkg = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    peerDependencies: pkg.peerDependencies,
    dependencies: pkg.dependencies,
    main: entry.require,
    module: entry.import,
    types: entry.types,
    exports: distExports,
  }

  fs.writeFileSync(path.resolve(currentDir, outDir, "package.json"), JSON.stringify(distPkg, null, 2) + "\n")
  console.log("✔ dist/package.json generated")
}
