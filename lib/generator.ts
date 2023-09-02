import { byteOrderMark, endOfLine, mkConfig } from "./config";
import { CsvGenerationError, EmptyHeadersError } from "./errors";
import { formatData, pack, unpack } from "./helpers";
import {
  CsvOutput,
  ConfigOptions,
  IO,
  WithDefaults,
  CsvRow,
  Newtype,
} from "./types";

const mkCsvOutput = pack<CsvOutput>;
const mkCsvRow = pack<CsvRow>;

// TODO: Should these types deal with CsvOutput? It might make a better type guarantee
// than string.
const addBOM =
  (config: WithDefaults<ConfigOptions>) =>
  (output: CsvOutput): CsvOutput =>
    config.useBom ? mkCsvOutput(unpack(output) + byteOrderMark) : output;

const addTitle =
  (config: WithDefaults<ConfigOptions>) =>
  (output: CsvOutput): CsvOutput =>
    config.showTitle ? mkCsvOutput(unpack(output) + config.title) : output;

const addEndOfLine =
  (output: CsvOutput) =>
  (row: CsvRow): CsvOutput =>
    mkCsvOutput(unpack(output) + unpack(row) + endOfLine);

const buildRow =
  (config: WithDefaults<ConfigOptions>) =>
  (row: CsvRow, data: string): CsvRow =>
    addFieldSeparator(config)(mkCsvRow(row + data));

const addFieldSeparator =
  (config: WithDefaults<ConfigOptions>) =>
  <T extends Newtype<any, string>>(output: T): T =>
    pack<T>(unpack(output) + config.fieldSeparator);

const addHeaders =
  (config: WithDefaults<ConfigOptions>, headers: Array<string>) =>
  (output: CsvOutput): CsvOutput => {
    if (!config.showColumnHeaders) {
      return output;
    }

    if (headers.length < 1) {
      throw new EmptyHeadersError(
        "Option to show headers but none supplied. Make sure there are keys in your collection or that you've supplied headers through the config options.",
      );
    }

    let row = mkCsvRow("");
    for (let keyPos = 0; keyPos < headers.length; keyPos++) {
      row = buildRow(config)(row, headers[keyPos]);
    }

    row = mkCsvRow(unpack(row).slice(0, -1));
    return addEndOfLine(output)(row);
  };

const addBody =
  <T extends Array<{ [k: string]: unknown }>>(
    config: WithDefaults<ConfigOptions>,
    headers: Array<string>,
    bodyData: T,
  ) =>
  (output: CsvOutput): CsvOutput => {
    let body = output;
    for (var i = 0; i < bodyData.length; i++) {
      let row = mkCsvRow("");
      for (let keyPos = 0; keyPos < headers.length; keyPos++) {
        const header = headers[keyPos];
        row = buildRow(config)(row, formatData(config, bodyData[i][header]));
      }

      // Remove trailing comma
      row = mkCsvRow(unpack(row).slice(0, -1));
      body = addEndOfLine(body)(row);
    }

    return body;
  };

export const generateCsv =
  (config: ConfigOptions) =>
  <T extends { [k: string | number]: unknown }>(data: Array<T>): CsvOutput => {
    const withDefaults = mkConfig(config);
    const headers = withDefaults.useKeysAsHeaders
      ? Object.keys(data[0])
      : withDefaults.columnHeaders;

    let output = mkCsvOutput("");

    output = addBOM(withDefaults)(output);
    output = addTitle(withDefaults)(output);
    output = addHeaders(withDefaults, headers)(output);
    output = addBody(withDefaults, headers, data)(output);

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
