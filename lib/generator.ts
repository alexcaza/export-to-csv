import { mkConfig } from "./config";
import { CsvGenerationError } from "./errors";
import { addBOM, addBody, addHeaders, addTitle, thread } from "./helpers";
import { CsvOutput, ConfigOptions, IO, mkCsvOutput, unpack } from "./types";

export const generateCsv =
  (config: ConfigOptions) =>
  <T extends { [k: string | number]: unknown }>(data: Array<T>): CsvOutput => {
    const withDefaults = mkConfig(config);
    const headers = withDefaults.useKeysAsHeaders
      ? Object.keys(data[0])
      : withDefaults.columnHeaders;

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

export const download =
  (config: ConfigOptions) =>
  (csvOutput: CsvOutput): IO => {
    const withDefaults = mkConfig(config);
    const data = unpack(csvOutput);
    // Create CSV blob to download if requesting in the browser and the
    // consumer doesn't set the shouldReturnCsv param
    const fileType = withDefaults.useTextFile ? "plain" : "csv";
    const fileExtension = withDefaults.useTextFile ? "txt" : "csv";
    let blob = new Blob([data], {
      type: `text/${fileType};charset=utf8;`,
    });

    let link = document.createElement("a");
    link.download = `${withDefaults.filename}.${fileExtension}`;
    link.href = URL.createObjectURL(blob);

    link.setAttribute("visibility", "hidden");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
