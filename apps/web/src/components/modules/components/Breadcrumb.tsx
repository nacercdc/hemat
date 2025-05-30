"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useBreadcrumbs } from "~/providers/breadcrumb/BreadcrumbProvider";
import { useEffect, useState } from "react";

export function Breadcrumbs() {
  const { breadcrumbs } = useBreadcrumbs();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link
                  href={item.href}
                  className="hover:underline text-dark-light hover:text-dark"
                >
                  {item.title}
                </Link>
                <Icon
                  icon="mdi:slash-forward"
                  className="h-4 w-4 text-dark-light"
                />
              </>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {item.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
