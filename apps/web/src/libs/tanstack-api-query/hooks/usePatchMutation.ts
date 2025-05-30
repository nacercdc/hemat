import { useMutation } from "@tanstack/react-query";
import type { RequestConfig } from "../helpers/types";
import { cleanPath } from "~/utils/string.util";
import useFetch from "../helpers/hooks/useFetch";

export function usePatchMutation<Entity, Mutate = Entity>(path: string) {
  const {
    methods: { patch },
  } = useFetch();
  return useMutation<Entity, Error, RequestConfig & { data: Mutate }>({
    mutationFn: async (request) => {
      let fullPath = cleanPath(path);
      if (request?.id) {
        fullPath = cleanPath(`${fullPath}/${request.id}`);
      }

      return await patch<Entity, Mutate>({
        path: fullPath,
        isProtected: request?.isProtected ?? true,
        data: request.data,
        configs: {
          baseURL: request?.baseURL,
          headers: request?.headers,
        },
      });
    },
  });
}
