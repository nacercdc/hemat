/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortDirectionEnum } from "./types";
import type {
  Method,
  QueryManyRequest,
  RequestConfig,
  RequestHeaders,
} from "./types";

export function buildRequest<T = any>(
  headers: Headers,
  method: Method,
  request: RequestConfig,
  data?: T,
  requestInit?: RequestInit,
  multipart?: boolean
): RequestInit {
  return {
    ...requestInit,
    ...request,
    method,
    body: data ? prepareData(data, multipart) : null,
    headers: buildRequestHeaders(headers, request.headers),
  };
}

function prepareData(data?: any, multipart = false) {
  return typeof data === "object" && !multipart ? JSON.stringify(data) : data;
}

export async function retrieveResponseText(
  response: Response
): Promise<string> {
  const text = await response.text().catch((err) => {
    throw err;
  });

  if (!response.ok) throw new Error(text);

  return text;
}

export function buildRequestHeaders(
  headers: Headers,
  requestHeaders?: RequestHeaders
): Headers {
  if (requestHeaders) {
    Object.entries(requestHeaders).forEach(([key, value]) => {
      if (value) {
        headers.set(key, value);
      }
    });
  }
  return headers;
}

export function buildQueryString<
  Include = unknown,
  Filterable = unknown,
  Sortable = unknown,
>(query: QueryManyRequest<Include, Filterable, Sortable>): string {
  const params = new URLSearchParams();
  if (query.filters) {
    Object.keys(query.filters).forEach((fKey) => {
      params.set(`${fKey}`, `${query.filters?.[fKey as keyof Filterable]}`);
    });
  }

  if (query.include && query.include.length > 0) {
    params.append("include", query.include.join(","));
  }

  if (query.search !== undefined) {
    params.set("search", query.search.toString());
  }

  if (query.sorts !== undefined) {
    if (SortDirectionEnum.ASC in query.sorts)
      params.set(
        `${SortDirectionEnum.ASC}`,
        query.sorts[SortDirectionEnum.ASC] as string
      );
    if (SortDirectionEnum.DESC in query.sorts)
      params.set(
        `${SortDirectionEnum.DESC}`,
        query.sorts[SortDirectionEnum.DESC] as string
      );
  }

  if (query.skip !== undefined) {
    params.set("skip", query.skip.toString());
  }

  if (query.take !== undefined) {
    params.set("take", query.take.toString());
  }

  return params.toString() ? `?${params.toString()}` : "";
}
