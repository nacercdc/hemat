/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "~/env";
import { useFetchRequest } from "./useRequest";
import type { QueryManyRequest, RequestConfig } from "../types";
export interface Query<
  Include = unknown,
  Filterable = unknown,
  Sortable = unknown,
> {
  path: string;
  configs?: Omit<RequestConfig, "data">;
  queries?: QueryManyRequest<Include, Filterable, Sortable>;
  isProtected?: boolean;
}
export interface Mutation<Entity> {
  path: string;
  data?: Entity;
  isProtected?: boolean;
  configs?: Omit<RequestConfig, "data">;
  multipart?: boolean;
}
export default function useFetch() {
  const { request } = useFetchRequest({
    baseUrl: env.NEXT_PUBLIC_HOST_URL,
  });
  async function get<
    Entity,
    Res = any,
    Include = unknown,
    Filterable = unknown,
    Sortable = unknown,
  >(options: Query<Include, Filterable, Sortable>): Promise<Res> {
    return request<Entity, Res, Include, Filterable, Sortable>({
      method: "GET",
      isProtected: options?.isProtected,
      ...options,
    });
  }

  async function post<Res = any, Req = any>(
    option: Mutation<Req>
  ): Promise<Res> {
    return request<Res, Res>({
      method: "POST",
      isProtected: option?.isProtected,
      path: option.path,
      data: option.data as any,
      configs: option.configs,
      multipart: option?.multipart,
    });
  }

  async function put<Res = any, Req = any>(
    option: Mutation<Req>
  ): Promise<Res> {
    return request<Res, Res>({
      method: "PUT",
      isProtected: option?.isProtected,
      path: option.path,
      data: option.data as any,
      configs: option.configs,
    });
  }

  async function patch<Res = any, Req = any>(
    option: Mutation<Req>
  ): Promise<Res> {
    return request<Res, Res>({
      method: "PATCH",
      isProtected: option?.isProtected,
      path: option.path,
      data: option.data as any,
      configs: option.configs,
    });
  }

  async function remove<Res = any>(
    option: Omit<Mutation<any>, "data">
  ): Promise<Res> {
    return request<Res, any>({
      path: option.path,
      isProtected: option?.isProtected,
      configs: option?.configs,
      method: "DELETE",
    });
  }

  return {
    methods: { get, post, put, patch, delete: remove },
  };
}
