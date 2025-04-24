"use client";

import { useEffect, useState } from "react";
import { useCollectionQuery } from "@e-market/tanstack-web-firebase-query";
import type {
  DocumentData,
  DocumentSnapshot,
} from "@e-market/tanstack-web-firebase-query";
import { useQueryClient } from "@tanstack/react-query";

type FilterType = Record<string, Record<string, string>>;

const getFilters = <T extends DocumentData>(
  filters: Partial<Record<keyof T, T[keyof T] | undefined>>
) => {
  const newFilters: FilterType = {};
  Object.keys(filters).forEach((filterKey) => {
    if (filters[filterKey]) {
      newFilters[filterKey] = { eq: filters[filterKey] };
    }
  });

  return newFilters;
};

interface Props<T extends DocumentData> {
  collectionName: string;
  pageSize: number;
  searchValue?: T[keyof T];
  searchKey?: keyof T;
  filters?: Partial<Record<keyof T, T[keyof T] | undefined>>;
  defaultOrderByKey?: keyof T;
  defaultOrderByValue?: "asc" | "desc";
}

export function usePaginatedCollectionQuery<T extends DocumentData>({
  collectionName,
  pageSize = 10,
  searchKey,
  searchValue,
  filters,
  defaultOrderByKey = "createdAt",
  defaultOrderByValue = "desc",
}: Props<T>) {
  const [page, setPage] = useState(1);
  const [lastVisibleSnapshot, setLastVisibleShapshot] = useState<
    DocumentSnapshot<DocumentData> | undefined
  >();
  const [_orderByValue, _setOrderByValue] = useState<"desc" | "asc">(
    defaultOrderByValue
  );
  const [_orderByKey, _setOrderByKey] = useState<keyof T>(defaultOrderByKey);

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useCollectionQuery({
    collectionName,
    tqQueryOptions: {
      queryKey: [collectionName, page, searchKey, searchValue],
    },
    queryOptions: {
      limit: pageSize,
      // OrderBy is not working at the moment
      // orderBy: { [orderByKey]: orderByValue },
      filters: filters ? getFilters(filters) : undefined,
      startAfter: lastVisibleSnapshot,
    },
  });

  useEffect(() => {
    resetBeforeFetch();
  }, []);

  useEffect(() => {
    if (data?.lastDoc) {
      setLastVisibleShapshot(data.lastDoc);
    }
  }, [data?.lastDoc]);

  const nextPage = () => {
    if (lastVisibleSnapshot && (data?.data.length ?? 0) === pageSize) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const _handleSort = (_value: "asc" | "desc", _key: keyof T) => {
    // TODO: Implement sorting
  };

  const resetBeforeFetch = async () => {
    setLastVisibleShapshot(undefined);
    await queryClient.invalidateQueries({ queryKey: ["users"] });
    setPage(1);
  };

  return {
    data: data?.data,
    isLoading,
    isError,
    error,
    nextPage,
    prevPage,
    resetBeforeFetch,
  };
}
