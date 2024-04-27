import { FC, useCallback } from "react";
import { downloadBlob } from "shared/lib/fileHelper";
import { ExportFilesButton } from "entities/files-info";
import { useExportEntitiesFileMutation } from "entities/exporter/lib/api/exporter-service";
import { onExportArgs } from "entities/files-info/export/ui/button";
import { useGetExportEntitiesInfoQuery, useLazyGetExportEntitiesInfoQuery } from "./lib";

export interface ExportEntitiesButtonProps {
  disabled?: boolean;
  entitiesName: string;
  selectedIds: string[] | null;
  excludedIds?: string[] | null;
  includeAll?: boolean;
}

export const ExportEntitiesButton: FC<ExportEntitiesButtonProps> = ({
  disabled,
  entitiesName,
  selectedIds,
  excludedIds,
  includeAll = true,
}) => {
  const { isError, isLoading } = useGetExportEntitiesInfoQuery(entitiesName);

  const [getFilesExportInfo] = useLazyGetExportEntitiesInfoQuery();
  const [exportEntitiesFile, { isLoading: isLoadingExportEntities }] = useExportEntitiesFileMutation();

  const onFilesInfo = useCallback(
    async () => await getFilesExportInfo(entitiesName).unwrap(),
    [entitiesName, getFilesExportInfo]
  );

  const onExport = useCallback(
    async ({ destinationTypeIdentifier, addonIdentifier} : onExportArgs) => {
      exportEntitiesFile({
        destinationTypeIdentifier: destinationTypeIdentifier ?? "StdFile",
        addonIdentifier,
        entitiesName,
        body: {
          includeAll,
          idsToInclude: selectedIds,
          idsToExclude: excludedIds,
        },
      })
        .unwrap()
        .then(downloadBlob);
    },
    [entitiesName, excludedIds, exportEntitiesFile, includeAll, selectedIds]
  );

  return isError || isLoading ? (
    <></>
  ) : (
    <ExportFilesButton
      tooltipContent="Экспортировать дерево объектов мониторинга в файл"
      loading={isLoadingExportEntities}
      disabled={disabled}
      onExport={onExport}
      getFilesInfo={onFilesInfo}
    />
  );
};
