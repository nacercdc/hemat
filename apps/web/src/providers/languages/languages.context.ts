import { createContext } from "react";
import type { Language } from "~/libs/models/language.model";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { UseQueryResult } from "~/libs/tanstack-api-query/types";

export const LanguagesContext = createContext<
  UseQueryResult<QueryManyResponse<QueryManyResponse<Language>>, Error>
>({} as UseQueryResult<QueryManyResponse<QueryManyResponse<Language>>, Error>);
