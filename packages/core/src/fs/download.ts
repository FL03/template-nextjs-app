/**
 * Created At: 2025.10.26:22:29:38
 * @author - @FL03
 * @directory - src/lib/fs
 * @file - downloaders.ts
 */

/** Defines common file-extensions  */
type FileExtensions = "json" | "csv";

/** The `FileName` type defines a string representation of the file name divided into two components, the name and the extension. */
export type FileName<
  Name extends string,
  Ext extends string = FileExtensions,
> = `${Name}.${Ext}`;

export type CsvFileExt<Name extends string = string> = FileName<Name, "csv">;
export type JsonFileExt<Name extends string = string> = FileName<Name, "json">;

/**
 * A client-side method for triggering file downloads in the browser.
 *
 * @deprecated use  `downloadFile` from `@pzzld/js/fs` instead
 * @param value - The Blob or URL string representing the file to be downloaded.
 * @param filename - The desired name for the downloaded file.
 */
export function triggerFileDownload(value: Blob | string, filename: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  // parse the given value
  const url = value instanceof Blob ? URL.createObjectURL(value) : value;
  // create the element
  const link = window.document.createElement("a");
  link.href = url;
  link.download = filename;
  // append to body
  window.document.body.appendChild(link);
  // trigger action
  link.click();
  // cleanup
  link.parentNode?.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Downloads the given data as a JSON file with the specified filename.
 *
 * @param data - The data to be converted to JSON and downloaded.
 * @param filename - The desired name for the downloaded JSON file;
 */
export function downloadAsJSON<T>(data: T, filename: JsonFileExt) {
  const blob = new Blob([JSON.stringify(data, undefined, 2)], {
    type: "application/json",
  });
  triggerFileDownload(blob, filename);
}

export function convertToCsv<T extends Object>(obj: T): string {
  const data = Array.isArray(obj) ? obj : [obj];
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]).join(",");
  const rows = data
    .map((item) =>
      Object.values(item)
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
  return `${headers}\n${rows}`;
}

export function downloadAsCSV<T extends Object>(data: T, filename: CsvFileExt) {
  const csvData = convertToCsv(data);
  const blob = new Blob([csvData], { type: "text/csv" });
  triggerFileDownload(blob, filename);
}
