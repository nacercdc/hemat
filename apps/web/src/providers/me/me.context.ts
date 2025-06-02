import { createContext } from "react";
import type { User } from "~/libs/models/user.model";
import type { UseQueryResult } from "~/libs/tanstack-api-query/types";

export const MeContext = createContext<UseQueryResult<User, Error>>(
  {} as UseQueryResult<User, Error>
);
