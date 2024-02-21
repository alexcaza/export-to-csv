// Required for `window` to work. Since `types` is set in `tsconfig.json`
// `lib` no longer works
/// <reference lib="dom" />

import { mkConfig } from "./config.ts";
import { CsvDownloadEnvironmentError, CsvGenerationError } from "./errors.ts";
import { addBOM, addBody, addHeaders, addTitle, thread } from "./helpers.ts";
import { CsvOutput, ConfigOptions, IO, mkCsvOutput, unpack } from "./types.ts";

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
  <T extends { [k: string | number]: unknown }>(data: Array<T>): CsvOutput => {
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

    const withDefaults = mkConfig(config);
    const data = unpack(csvOutput);

    // Create blob from CsvOutput either as text or csv file.
    const fileType = withDefaults.useTextFile ? "plain" : "csv";
    const fileExtension = withDefaults.useTextFile ? "txt" : "csv";
    let blob = new Blob([data], {
      type: `text/${fileType};charset=utf8;`,
    });

    // Create link element in the browser and set the download
    // attribute to the blob that was created.
    let link = document.createElement("a");
    link.download = `${withDefaults.filename}.${fileExtension}`;
    link.href = URL.createObjectURL(blob);

    // Ensure the link isn't visible to the user or cause layout shifts.
    link.setAttribute("visibility", "hidden");

    // Add to document body, click and remove it.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
