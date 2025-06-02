import { useMutation } from "@tanstack/react-query";

import type { RequestConfig } from "../helpers/types";
import { cleanPath } from "~/utils/string.util";
import useFetch from "../helpers/hooks/useFetch";

export function useDeleteMutation<Entity>(path: string) {
  const {
    methods: { delete: remove },
  } = useFetch();

  return useMutation<Entity, Error, RequestConfig>({
    mutationFn: async (request) => {
      let fullPath = cleanPath(path);
      if (request?.id) {
        fullPath = cleanPath(`${fullPath}/${request.id}`);
      }
      return await remove<Entity>({
        path: fullPath,
        isProtected: request.isProtected ?? true,
        configs: {
          baseURL: request?.baseURL,
          headers: request?.headers,
        },
      });
    },
  });
}
