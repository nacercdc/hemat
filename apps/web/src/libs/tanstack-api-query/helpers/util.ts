/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNill } from "@etm/utilities/string.utils";
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
  requestInit?: RequestInit
): RequestInit {
  return {
    ...requestInit,
    ...request,
    method,
    body: data ? prepareData(data) : null,
    headers: buildRequestHeaders(headers, request.headers),
  };
}

function prepareData(data?: any) {
  return typeof data === "object" ? JSON.stringify(data) : data;
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
    const filters = query.filters.filter((v) => !isNill(v.value));
    query.filters = filters;
  }

  if (query.include && query.include.length > 0) {
    params.append("include", query.include.join(","));
  }

  if (query.search !== undefined) {
    params.set("search", query.search.toString());
  }

  if (query.page !== undefined) {
    params.set("page", query.page.toString());
  }

  if (query.limit !== undefined) {
    params.set("limit", query.limit.toString());
  }

  return params.toString() ? `?${params.toString()}` : "";
}
