// Required for `window` to work. Since `types` is set in `tsconfig.json`
// `lib` no longer works
/// <reference lib="dom" />

import { mkConfig } from "./config.ts";
import { CsvDownloadEnvironmentError, CsvGenerationError } from "./errors.ts";
import { addBOM, addBody, addHeaders, addTitle, thread } from "./helpers.ts";
import {
  CsvOutput,
  ConfigOptions,
  IO,
  mkCsvOutput,
  unpack,
  AcceptedData,
} from "./types.ts";

/**
 *
 * Generates CsvOutput data from JSON collection using
 * ConfigOptions given.
 *
 * To comfortably use the data as a string around your
 * application, look at {@link asString}.
 *
 * @throws {CsvGenerationError | EmptyHeadersError}
 */
export const generateCsv =
  (config: ConfigOptions) =>
  <
    T extends {
      [k: string | number]: AcceptedData;
    },
  >(
    data: Array<T>,
  ): CsvOutput => {
    const withDefaults = mkConfig(config);
    const headers = withDefaults.useKeysAsHeaders
      ? Object.keys(data[0])
      : withDefaults.columnHeaders;

    // Build csv output starting with an empty string
    let output = thread(
      mkCsvOutput(""),
      addBOM(withDefaults),
      addTitle(withDefaults),
      addHeaders(withDefaults, headers),
      addBody(withDefaults, headers, data),
    );

    if (unpack(output).length < 1) {
      throw new CsvGenerationError(
        "Output is empty. Is your data formatted correctly?",
      );
    }

    return output;
  };

/**
 * Returns the Blob representation of the CsvOutput generated
 * by `generateCsv`. This is useful if you need to access the
 * data for downloading in other contexts; like browser extensions.
 */
export const asBlob =
  (config: ConfigOptions) =>
  (csvOutput: CsvOutput): Blob => {
    const withDefaults = mkConfig(config);
    const data = unpack(csvOutput);

    // Create blob from CsvOutput either as text or csv file.
    const fileType = withDefaults.useTextFile ? "plain" : "csv";
    const blob = new Blob([data], {
      type: `text/${fileType};charset=utf8;`,
    });

    return blob;
  };

/**
 *
 * **Only supported in browser environment.**
 *
 * Will create a hidden anchor link in the page with the
 * download attribute set to a blob version of the CsvOutput data.
 *
 * @throws {CsvDownloadEnvironmentError}
 */
export const download =
  (config: ConfigOptions) =>
  (csvOutput: CsvOutput): IO => {
    // Downloading is only supported in a browser environment.
    // Node users can simply write the output from generateCsv
    // to disk.
    if (!window) {
      throw new CsvDownloadEnvironmentError(
        "Downloading only supported in a browser environment.",
      );
    }

    // Create blob from CsvOutput either as text or csv file.
    const blob = asBlob(config)(csvOutput);

    const withDefaults = mkConfig(config);
    const fileExtension = withDefaults.useTextFile
      ? "txt"
      : withDefaults.fileExtension;

    const fileName = `${withDefaults.filename}.${fileExtension}`;

    // Create link element in the browser and set the download
    // attribute to the blob that was created.
    const link = document.createElement("a");
    link.download = fileName;
    link.href = URL.createObjectURL(blob);

    // Ensure the link isn't visible to the user or cause layout shifts.
    link.setAttribute("visibility", "hidden");

    // Add to document body, click and remove it.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
