"use client";

import type {
  ModalRef,
  PaginationState,
  SortingState,
} from "@etm/web-ui-components";
import { Button, Modal, useToast } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ScaleTable } from "./components/table";
import { useRef, useState, useCallback } from "react";

import { ScaleForm } from "./components/form";
import { PageContainer } from "../components/PageContainer";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  Scale,
  ScaleCreate,
  ScaleFilterable,
  ScaleSortable,
} from "~/libs/models/scale.model";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from "~/constants";

export default function MeasurementScale() {
  const addScaleModalRef = useRef<ModalRef>(null);
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

  const { mutate: createScale, ...createScaleState } = useAddMutation<
    Scale,
    ScaleCreate
  >("measurement-scales");

  const { data: scales, ...scalesState } = useFindAll<
    QueryManyResponse<Scale>,
    unknown,
    ScaleFilterable,
    ScaleSortable
  >({
    path: "/measurement-scales",
    queries: {
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      search,
      sorts: { ascending: "rate" },
    },
  });

  const openAddScaleModal = () => addScaleModalRef.current?.openModal();
  const onCancelScaleFormHandler = () => addScaleModalRef.current?.closeModal();

  const onSubmitScaleFormHandler = (data: ScaleCreate) => {
    createScale(
      {
        data,
        isProtected: true,
      },
      {
        onSuccess: () => {
          scalesState.refetch();
          addScaleModalRef.current?.closeModal();
          toaster.toast({
            title: "Success",
            message: "Scale created successfully",
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
        field: v.id as keyof Scale,
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
      pageTitle="Measurement Scale"
      includeBreadcrumb={false}
      actionNodes={
        <Button
          leftNode={
            <Icon icon={"material-symbols:add"} className="!w-5 !h-5" />
          }
          size="lg"
          onClick={openAddScaleModal}
        >
          Create
        </Button>
      }
    >
      <ScaleTable
        scales={(scales?.data as unknown as Scale[]) ?? []}
        isLoading={scalesState.isFetching}
        refetch={scalesState.refetch}
        onSortingChange={onSortingChangeHandler}
        onSearchFilterChange={onSearchFilterChangeHandler}
        onPaginationChange={setPagination}
        openAddScaleModal={openAddScaleModal}
      />
      <Modal ref={addScaleModalRef}>
        <div className="flex flex-col gap-4">
          <ScaleForm
            isLoading={createScaleState.isPending}
            onSubmitScaleFormHandler={onSubmitScaleFormHandler}
            onCancelScaleFormHandler={onCancelScaleFormHandler}
          />
        </div>
      </Modal>
    </PageContainer>
  );
}
