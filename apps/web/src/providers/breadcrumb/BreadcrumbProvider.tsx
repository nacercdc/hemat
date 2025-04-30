"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  breadcrumbs: [],
});

export function BreadcrumbProvider({
  children,
  initialPath,
}: {
  children: React.ReactNode;
  initialPath?: string;
}) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>(() => {
    return initialPath
      ? generateBreadcrumbs(initialPath)
      : [{ title: "Dashboard", href: "/" }];
  });

  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      setBreadcrumbs(generateBreadcrumbs(pathname));
    }
  }, [pathname]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  if (path === "/") return [{ title: "Dashboard", href: "/" }];

  const segments = path.split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ title: "Dashboard", href: "/" }];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    crumbs.push({
      title: segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      href: currentPath,
    });
  }

  return crumbs;
}

export function useBreadcrumbs() {
  return useContext(BreadcrumbContext);
}
