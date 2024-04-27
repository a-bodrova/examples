import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { Paging } from "models/json-api/Paging";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { paginationSelector, setPagination } from "./paginationSlice";

interface usePagingArgs {
  pathname?: string; // for fullscreen modals with pagination inside
}

interface UsePagingReturn {
  paging: Paging;
  setPaging: (paging: Paging) => void;
  setPage: (page: number) => void;
  resetPaging: () => void;
}

export const usePaging = ({ pathname }: usePagingArgs = {}): UsePagingReturn => {
  const dispatch = useAppDispatch();
  const { pathname: path } = useLocation();
  const currentPagination = useAppSelector(paginationSelector(pathname ?? path));
  const defaultPagination = useAppSelector(paginationSelector("default"));
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("page") && !pathname) {
      setSearchParams({
        page: String(currentPagination?.page ?? defaultPagination.page),
        size: String(currentPagination?.size ?? defaultPagination.size),
      });
    }
  }, [currentPagination, defaultPagination, pathname, searchParams, setSearchParams]);

  const [paging, setPaging] = useState<Paging>({
    number: Number(currentPagination?.page ?? searchParams.get("page") ?? defaultPagination.page),
    size: Number(currentPagination?.size ?? searchParams.get("size") ?? defaultPagination.size),
  });

  useEffect(() => {
    dispatch(setPagination({ path: pathname ?? path, pagination: { page: paging.number, size: paging.size } }));
    !pathname && setSearchParams({ page: String(paging.number), size: String(paging.size) });
  }, [dispatch, paging, path, pathname, setSearchParams]);

  const setPage = useCallback((page: number) => {
    setPaging((prev) => ({ ...prev, number: page }));
  }, []);

  const onSetPaging = useCallback((paging: Paging) => {
    setPaging((prev) => ({ ...prev, ...paging }));
  }, []);

  const resetPaging = useCallback(() => {
    setPage(defaultPagination.page);
  }, [defaultPagination.page, setPage]);

  return {
    setPage,
    paging,
    setPaging: onSetPaging,
    resetPaging,
  };
};
