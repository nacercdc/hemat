/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Method, QueryManyRequest, RequestConfig } from "../types";
import {
  buildQueryString,
  buildRequest,
  buildRequestHeaders,
  retrieveResponseText,
} from "../util";
import { cleanPath } from "~/utils/string.util";
import { getSession } from "../utils/session";
import type { SessionPayload } from "../utils/session";

const headers = new Headers({
  "Content-type": "application/json",
  Accept: "application/json",
});

interface UseFetchRequest {
  baseUrl: string;
  requestInit?: RequestInit;
}

interface Request<
  Entity,
  Include = unknown,
  Filterable = unknown,
  Sortable = unknown,
> {
  method: Method;
  path: string;
  configs?: RequestConfig;
  isProtected?: boolean;
  data?: Entity;
  queries?: QueryManyRequest<Include, Filterable, Sortable>;
}
export const useFetchRequest = ({ baseUrl, requestInit }: UseFetchRequest) => {
  async function request<
    Entity,
    Res,
    Include = unknown,
    Filterable = unknown,
    Sortable = unknown,
  >(options: Request<Entity, Include, Filterable, Sortable>): Promise<Res> {
    // base url setup
    const url = new URL(
      cleanPath(options.path),
      options?.configs?.baseURL
        ? `${cleanPath(options?.configs.baseURL)}/`
        : `${cleanPath(baseUrl)}/`
    );

    // setup url search
    if (options?.queries) {
      url.search = buildQueryString(options.queries);
    }

    // setup session
    let session: SessionPayload | null = null;

    if (options?.isProtected) {
      try {
        session = await getSession();
      } catch (_err) {}

      if (!session) throw new Error("Unauthenticated.");
    }

    const request = new Request(
      url,
      buildRequest<Entity>(
        buildRequestHeaders(headers, {
          Authorization: `Bearer ${session?.token}`,
        }),
        options.method,
        {
          headers: options?.configs?.headers,
        },
        options?.data,
        requestInit
      )
    );

    const response = await fetch(request).catch((err) => {
      throw err;
    });

    const text = await retrieveResponseText(response);

    try {
      return JSON.parse(text) as Res;
    } catch {
      return text as Res;
    }
  }
  return {
    request,
  };
};
