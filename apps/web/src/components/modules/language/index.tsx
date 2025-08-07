"use client";

import { Icon } from "@iconify/react";
import type {
  ModalRef,
  PaginationState,
  SortingState,
} from "@etm/web-ui-components";
import { Button, Modal, useToast } from "@etm/web-ui-components";
import { LanguageTable } from "./components/table";
import { PageContainer } from "../components/PageContainer";
import { useRef, useState, useCallback } from "react";
import type { LanguageFormData } from "./components/form";
import { LanguageForm } from "./components/form";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  Language,
  LanguageCreate,
  LanguageFilterable,
  LanguageSortable,
} from "~/libs/models/language.model";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";

export function Language() {
  const addLanguageModalRef = useRef<ModalRef>(null);
  const toaster = useToast();
  const [search, setSearch] = useState("");
  const [_sort, setSort] = useState<
    {
      direction: string;
      field: string | number | symbol;
    }[]
  >([
    {
      direction: "desc",
      field: "created_at",
    },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { mutate: createLanguage, ...createLanguageState } = useAddMutation<
    Language,
    LanguageCreate
  >("languages");

  const { data: languages, ...languagesState } = useFindAll<
    QueryManyResponse<Language>,
    unknown,
    LanguageFilterable,
    LanguageSortable
  >({
    path: "/languages",
    queries: {
      take: pagination.pageSize,
      skip: pagination.pageIndex + 1,
      search,
    },
  });

  const openAddLanguageModal = () => addLanguageModalRef.current?.openModal();

  const onCancelLanguageFormHandler = () =>
    addLanguageModalRef.current?.closeModal();

  const onSubmitLanguageFormHandler = (data: LanguageFormData) => {
    createLanguage(
      {
        data: {
          name: data.name,
          code: data.code,
          native: data.native,
        },
        isProtected: true,
      },
      {
        onSuccess: () => {
          languagesState.refetch();
          addLanguageModalRef.current?.closeModal();
          toaster.toast({
            title: "Success",
            message: "Language added successfully",
            variant: "success",
          });
        },
      }
    );
  };

  const onSortingChangeHandler = (sortingState: SortingState) => {
    setSort(
      sortingState.map((v) => ({
        direction: v.desc ? "desc" : "asc",
        field: v.id as keyof Language,
      }))
    );
    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  };

  const onSearchFilterChangeHandler = useCallback((value: string) => {
    setSearch(value);
    setPagination({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  }, []);

  return (
    <PageContainer
      pageTitle="Language"
      includeBreadcrumb={false}
      actionNodes={
        <Button
          leftNode={
            <Icon icon={"material-symbols:add"} className="!w-5 !h-5" />
          }
          size="lg"
          onClick={openAddLanguageModal}
          loading={createLanguageState.isPending}
        >
          Add
        </Button>
      }
    >
      <LanguageTable
        languages={(languages?.data as unknown as Language[]) ?? []}
        isLoading={languagesState.isFetching}
        refetch={languagesState.refetch}
        onSortingChange={onSortingChangeHandler}
        onSearchFilterChange={onSearchFilterChangeHandler}
        onPaginationChange={setPagination}
        openAddLanguageModal={openAddLanguageModal}
      />
      <Modal ref={addLanguageModalRef}>
        <div className="flex flex-col gap-4">
          <LanguageForm
            isLoading={createLanguageState.isPending}
            onSubmitLanguageForm={onSubmitLanguageFormHandler}
            onCancelLanguageForm={onCancelLanguageFormHandler}
          />
        </div>
      </Modal>
    </PageContainer>
  );
}
