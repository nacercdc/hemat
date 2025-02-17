import type { QueryClientConfig } from "@tanstack/react-query";
import { createContext } from "react";

export interface TanstackQueryContextValue {
  queryClientConfig?: QueryClientConfig;
}

export const TanstackQueryContext = createContext<TanstackQueryContextValue>(
  {} as unknown as TanstackQueryContextValue
);
