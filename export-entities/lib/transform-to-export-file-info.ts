import { GetFilesExportInfo, ExportEntity, useLazyGetExportFilesInfoQuery } from "entities/exporter";
import { FileInfo } from "../model";

interface Destination {
  identifier: string;
  typeDesc: string;
}

export interface ExportFileInfo extends FileInfo {
  destination: Destination;
}

export type ExportFilesInfo = ExportFileInfo[];

const emptyArray: ExportFilesInfo = [];

export const transformToExportFileInfo = (filesInfo: GetFilesExportInfo | undefined): ExportFilesInfo => {
  if (filesInfo === undefined || filesInfo.results === undefined || filesInfo.results.length === 0) {
    return emptyArray;
  }

  return filesInfo.results.reduce<ExportFilesInfo>((exportFilesInfo, fileInfo): ExportFilesInfo => {
    const exportFileInfo: ExportFilesInfo =
      fileInfo.exportTypeFilesInfos?.map(
        (info): ExportFileInfo => ({
          addon: {
            desc: fileInfo.addonDesc ?? "",
            identifier: fileInfo.addonIdentifier ?? "",
            version: fileInfo.addonVersion ?? "",
          },
          destination: {
            identifier: info.destinationTypeIdentifier ?? "",
            typeDesc: info.destinationTypeDesc ?? "",
          },
        })
      ) ?? [];

    return [...exportFilesInfo, ...exportFileInfo];
  }, emptyArray);
};

export const useGetExportFilesInfo = () => {
  const [getFilesInfoFn, response] = useLazyGetExportFilesInfoQuery({
    selectFromResult: ({ data, ...response }) => ({
      data: transformToExportFileInfo(data),
      ...response,
    }),
  });

  const getFilesInfo = async (entity: ExportEntity) => {
    const filesInfo = await getFilesInfoFn({ entity }).unwrap();

    return transformToExportFileInfo(filesInfo);
  };

  return [getFilesInfo, response] as const;
};
