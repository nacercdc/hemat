"use client";

import React from "react";
import type { QueryClientConfig } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
  queryClientConfig?: QueryClientConfig;
  children: React.ReactNode;
}
export function TanstackQueryProvider({ children, queryClientConfig }: Props) {
  const queryClient = new QueryClient(queryClientConfig);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
