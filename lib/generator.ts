import { byteOrderMark, endOfLine, mkConfig } from "./config";
import { CsvGenerationError, EmptyHeadersError } from "./errors";
import { formatData, pack, unpack } from "./helpers";
import { CsvOutput, ConfigOptions, IO } from "./types";

const mkCsvOutput = pack<CsvOutput>;

export const generateCsv =
  (config: ConfigOptions) =>
  <T extends { [k: string | number]: unknown }>(data: Array<T>): CsvOutput => {
    const withDefaults = mkConfig(config);

    let output = "";

    if (withDefaults.useBom) {
      output += byteOrderMark;
    }

    if (withDefaults.showTitle) {
      output += withDefaults.title + endOfLine;
    }

    const headers = withDefaults.useKeysAsHeaders
      ? Object.keys(data[0])
      : withDefaults.columnHeaders;

    if (withDefaults.showColumnHeaders) {
      if (withDefaults.useKeysAsHeaders && headers.length < 1) {
        throw new EmptyHeadersError(
          "No column headers supplied but option to manually defined selected. Please pass headers along with config. Your CSV will contain no headers otherwise.",
        );
      }

      let row = "";
      for (let keyPos = 0; keyPos < headers.length; keyPos++) {
        row += headers[keyPos] + withDefaults.fieldSeparator;
      }

      row = row.slice(0, -1);
      output += row + endOfLine;
    }

    for (var i = 0; i < data.length; i++) {
      let row = "";
      for (let keyPos = 0; keyPos < headers.length; keyPos++) {
        const header = headers[keyPos];
        row +=
          formatData(withDefaults, data[i][header]) +
          withDefaults.fieldSeparator;
      }

      row = row.slice(0, -1);
      output += row + endOfLine;
    }

    if (output.length < 1) {
      throw new CsvGenerationError(
        "Output is empty. Is your data formatted correctly?",
      );
    }

    return mkCsvOutput(output);
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
      type: "text/" + fileType + ";charset=utf8;",
    });

    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    link.setAttribute("visibility", "hidden");
    link.download = `${withDefaults.filename}.${fileExtension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
