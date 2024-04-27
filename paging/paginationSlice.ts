import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { elementsPerPage } from "config/common";
import { RootState, Selector } from "store";

interface PaginationInfo {
  page: number;
  size: number;
}

interface PaginationInfoState {
  [path: string]: PaginationInfo;
}

interface PaginationActionArgs {
  path: "default" | string;
  pagination: Partial<PaginationInfo>;
}

const initialState: PaginationInfoState = {
  default: {
    page: 1,
    size: elementsPerPage,
  },
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPagination: (state, { payload }: PayloadAction<PaginationActionArgs>) => {
      return state[payload.path]
        ? {
            ...state,
            [payload.path]: {
              ...state[payload.path],
              page: payload.pagination.page ?? initialState.default.page,
              size: payload.pagination.size ?? initialState.default.size,
            },
          }
        : {
            ...state,
            [payload.path]: {
              page: payload.pagination.page ?? initialState.default.page,
              size: payload.pagination.size ?? initialState.default.size,
            },
          };
    },

    resetToDefault: () => initialState,
  },
});

export const { setPagination, resetToDefault } = paginationSlice.actions;

export const paginationSelector = (path: string): Selector<PaginationInfo> =>
  createSelector(
    (state: RootState) => state.pagination,
    (pagination) => pagination[path] ?? pagination.default
  );

export default paginationSlice.reducer;
