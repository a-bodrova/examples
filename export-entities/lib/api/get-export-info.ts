import { appPermissions } from "app/config/permissions";
import { ExportFilesInfo, transformToExportFileInfo } from "entities/files-info";
import { GetFilesExportInfo } from "models/Exporter";
import { exporterApi } from "shared/api/exporter";
import { Error, ErrorSpecialAttributes } from "shared/types/Error";
import { QueryReturn } from "shared/types/common";

const exportEntitiesApi = exporterApi.injectEndpoints({
  endpoints: (builder) => ({
    getExportEntitiesInfo: builder.query<ExportFilesInfo, string>({
      queryFn: async (entitiesName, { dispatch }) => {
        const res = (await dispatch(
          exporterApi.endpoints.getExportFilesInfo.initiate({
            entity: "Entities",
            params: {
              entitiesName,
            },
            permissions: [appPermissions.Method.GetExportEntitiesFilesInfo],
          })
        )) as QueryReturn<GetFilesExportInfo>;

        if (res.error) {
          if (res.error.status === 403) {
            const error: Error = {
              status: res.error.status,
              data: "",
              specialAttributes: [ErrorSpecialAttributes.DontExecDefaultHandler],
            };
            return { ...res, error };
          }

          return res;
        }

        return { data: transformToExportFileInfo(res.data) };
      },
    }),
  }),
});

export const { useGetExportEntitiesInfoQuery, useLazyGetExportEntitiesInfoQuery } = exportEntitiesApi;
