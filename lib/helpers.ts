import { byteOrderMark, endOfLine } from "./config.ts";
import { EmptyHeadersError } from "./errors.ts";
import {
  ColumnHeader,
  ConfigOptions,
  CsvOutput,
  CsvRow,
  HeaderDisplayLabel,
  HeaderKey,
  Newtype,
  WithDefaults,
  mkCsvOutput,
  mkCsvRow,
  mkHeaderDisplayLabel,
  mkHeaderKey,
  pack,
  unpack,
} from "./types.ts";

const getHeaderKey = (columnHeader: ColumnHeader): HeaderKey =>
  typeof columnHeader === "object"
    ? mkHeaderKey(columnHeader.key)
    : mkHeaderKey(columnHeader);

const getHeaderDisplayLabel = (
  columnHeader: ColumnHeader,
): HeaderDisplayLabel =>
  typeof columnHeader === "object"
    ? mkHeaderDisplayLabel(columnHeader.displayLabel)
    : mkHeaderDisplayLabel(columnHeader);

export const thread = <T>(initialValue: T, ...fns: Array<Function>): T =>
  fns.reduce((r, fn) => fn(r), initialValue);

export const addBOM =
  (config: WithDefaults<ConfigOptions>) =>
  (output: CsvOutput): CsvOutput =>
    config.useBom ? mkCsvOutput(unpack(output) + byteOrderMark) : output;

export const addTitle =
  (config: WithDefaults<ConfigOptions>) =>
  (output: CsvOutput): CsvOutput =>
    config.showTitle ? mkCsvOutput(unpack(output) + config.title) : output;

export const addEndOfLine =
  (output: CsvOutput) =>
  (row: CsvRow): CsvOutput =>
    mkCsvOutput(unpack(output) + unpack(row) + endOfLine);

export const buildRow =
  (config: WithDefaults<ConfigOptions>) =>
  (row: CsvRow, data: string): CsvRow =>
    addFieldSeparator(config)(mkCsvRow(row + data));

export const addFieldSeparator =
  (config: WithDefaults<ConfigOptions>) =>
  <T extends Newtype<any, string>>(output: T): T =>
    pack<T>(unpack(output) + config.fieldSeparator);

export const addHeaders =
  (config: WithDefaults<ConfigOptions>, headers: Array<ColumnHeader>) =>
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
      const header = getHeaderDisplayLabel(headers[keyPos]);
      row = buildRow(config)(row, formatData(config, header));
    }

    row = mkCsvRow(unpack(row).slice(0, -1));
    return addEndOfLine(output)(row);
  };

export const addBody =
  <T extends Array<{ [k: string]: unknown }>>(
    config: WithDefaults<ConfigOptions>,
    headers: Array<ColumnHeader>,
    bodyData: T,
  ) =>
  (output: CsvOutput): CsvOutput => {
    let body = output;
    for (var i = 0; i < bodyData.length; i++) {
      let row = mkCsvRow("");
      for (let keyPos = 0; keyPos < headers.length; keyPos++) {
        const header = getHeaderKey(headers[keyPos]);
        const data =
          typeof bodyData[i][unpack(header)] === "undefined"
            ? config.replaceUndefinedWith
            : bodyData[i][unpack(header)];
        row = buildRow(config)(row, formatData(config, data));
      }

      // Remove trailing comma
      row = mkCsvRow(unpack(row).slice(0, -1));
      body = addEndOfLine(body)(row);
    }

    return body;
  };

/**
 *
 * Convert CsvOutput => string for the typechecker.
 *
 * Useful if you need to take the return value and
 * treat is as a string in the rest of your program.
 */
export const asString = unpack<Newtype<any, string>>;

const isFloat = (input: any): boolean =>
  +input === input && (!isFinite(input) || Boolean(input % 1));

export const formatData = (config: ConfigOptions, data: any): string => {
  if (config.decimalSeparator === "locale" && isFloat(data)) {
    return data.toLocaleString();
  }

  if (config.decimalSeparator !== "." && isFloat(data)) {
    return data.toString().replace(".", config.decimalSeparator);
  }

  if (typeof data === "string") {
    let val = data;
    if (
      config.quoteStrings ||
      (config.fieldSeparator && data.indexOf(config.fieldSeparator) > -1) ||
      (config.quoteCharacter && data.indexOf(config.quoteCharacter) > -1) ||
      data.indexOf("\n") > -1 ||
      data.indexOf("\r") > -1
    ) {
      val =
        config.quoteCharacter +
        escapeDoubleQuotes(data, config.quoteCharacter) +
        config.quoteCharacter;
    }
    return val;
  }

  if (typeof data === "boolean" && config.boolDisplay) {
    // Convert to string to use as lookup in config
    const asStr = data ? "true" : "false";
    // Return the custom boolean display if set
    return config.boolDisplay[asStr];
  }
  return data;
};

/**
 * If double-quotes are used to enclose fields, then a double-quote
 * appearing inside a field must be escaped by preceding it with
 * another double quote.
 *
 * See https://www.rfc-editor.org/rfc/rfc4180
 */
function escapeDoubleQuotes(data: string, quoteCharacter?: string): string {
  if (quoteCharacter == '"' && data.indexOf('"') > -1) {
    return data.replace(/"/g, '""');
  }
  return data;
}
