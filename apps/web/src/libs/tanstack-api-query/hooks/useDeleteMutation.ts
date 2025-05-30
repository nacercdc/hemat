import { useMutation } from "@tanstack/react-query";

import type { RequestConfig } from "../helpers/types";
import { cleanPath } from "~/utils/string.util";
import useFetch from "../helpers/hooks/useFetch";

export function useDeleteMutation<Entity, Mutate = Entity>(path: string) {
  const {
    methods: { delete: remove },
  } = useFetch();

  return useMutation<Entity, Error, Omit<RequestConfig<Mutate>, "data">>({
    mutationFn: async (request) => {
      let fullPath = cleanPath(path);
      if (request?.id) {
        fullPath = cleanPath(`${fullPath}/${request.id}`);
      }
      return await remove<Entity>({
        path: fullPath,
        isProtected: request.isProtected,
        configs: {
          baseURL: request?.baseURL,
          headers: request?.headers,
        },
      });
    },
  });
}
