 
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { MutateFn } from "../types/tq";


export const mutationFn = async <T, C = T>({
  url,
  request,
  method,
}: MutateFn<C>): Promise<T> => {
  const headers: RequestInit["headers"] = {};
  if (!request?.webUpload) {
    headers["Content-Type"] = "application/json";
    if (request?.multipart) {
      headers["Content-Type"] = "multipart/form-data";
    }
    if (request?.lang) {
      headers["x-custom-lang"] = "EN";
    }
  }

  if (request?.params) {
    url = `${url}/${request.params}`;
  }

  if (request?.query) {
    const params = new URLSearchParams();
    for (const key of Object.keys(request.query)) {
      const value = (request.query as Record<string, unknown>)[key] || null;

      if (!value) {
        continue;
      }

      if (typeof value === "object" || Array.isArray(value)) {
        params.get(key)
          ? params.append(key, JSON.stringify(value))
          : params.set(key, JSON.stringify(value));
        continue;
      }
      params.get(key)
        ? params.append(key, value as string)
        : params.set(key, value as string);
    }
    url = `${url}?${params}`;
  }

  if (request?.token) {
    headers.Authorization = `Bearer ${request.token}`;
  }

  const requestInit: RequestInit = {
    method,
    headers,
  };

  if (request?.data) {
    requestInit.body =
      request.multipart || request.webUpload
        ? (request.data as unknown as FormData)
        : JSON.stringify(request.data);
  }

  return fetch(url, { ...requestInit })
    .then<T>(async (response) => {
      if (response.ok) {
        return response.json() as Promise<T>;
      }

      if (response.status === 413) {
        throw new Error("The overall size of the document is too large.");
      }

      if (response.status >= 500) {
        throw new Error("Server error");
      }

      throw new Error(await response.text());
    })
    .catch((error) => {
      if (error instanceof TypeError) {
        throw new Error("Network error or fetch was aborted");
      } else if (error instanceof SyntaxError) {
        throw new Error("Invalid data format.");
      } else {
        throw new Error(error);
      }
    });
};
