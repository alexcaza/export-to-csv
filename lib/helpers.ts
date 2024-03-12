import { byteOrderMark, endOfLine } from "./config.ts";
import { EmptyHeadersError, UnsupportedDataFormatError } from "./errors.ts";
import {
  AcceptedData,
  ColumnHeader,
  ConfigOptions,
  CsvOutput,
  CsvRow,
  FormattedData,
  HeaderDisplayLabel,
  HeaderKey,
  Newtype,
  WithDefaults,
  mkCsvOutput,
  mkCsvRow,
  mkFormattedData,
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
    config.showTitle
      ? addEndOfLine(mkCsvOutput(unpack(output) + config.title))(mkCsvRow(""))
      : output;

export const addEndOfLine =
  (output: CsvOutput) =>
  (row: CsvRow): CsvOutput =>
    mkCsvOutput(unpack(output) + unpack(row) + endOfLine);

export const buildRow =
  (config: WithDefaults<ConfigOptions>) =>
  (row: CsvRow, data: FormattedData): CsvRow =>
    addFieldSeparator(config)(mkCsvRow(unpack(row) + unpack(data)));

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
      row = buildRow(config)(row, formatData(config, unpack(header)));
    }

    row = mkCsvRow(unpack(row).slice(0, -1));
    return addEndOfLine(output)(row);
  };

export const addBody =
  <T extends Array<{ [k: string]: AcceptedData }>>(
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
        const data = bodyData[i][unpack(header)];
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

const isFloat = (input: boolean | string | number): boolean =>
  +input === input && (!isFinite(input) || Boolean(input % 1));

const formatNumber = (config: ConfigOptions, data: number): FormattedData => {
  if (isFloat(data)) {
    if (config.decimalSeparator === "locale") {
      return mkFormattedData(data.toLocaleString());
    }
    if (config.decimalSeparator) {
      return mkFormattedData(
        data.toString().replace(".", config.decimalSeparator),
      );
    }
  }

  return mkFormattedData(data.toString());
};

const formatString = (config: ConfigOptions, data: string): FormattedData => {
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
  return mkFormattedData(val);
};

const formatBoolean = (config: ConfigOptions, data: boolean): FormattedData => {
  // Convert to string to use as lookup in config
  const asStr = data ? "true" : "false";
  // Return the custom boolean display. We expect the callsite to validate
  // that `boolDisplay` is set.
  return mkFormattedData(config.boolDisplay![asStr]);
};

const formatNullish = (
  config: ConfigOptions,
  data: null | undefined,
): FormattedData => {
  if (
    typeof data === "undefined" &&
    config.replaceUndefinedWith !== undefined
  ) {
    // Coerce whatever was passed to a string
    return formatString(config, config.replaceUndefinedWith + "");
  }

  if (data === null) {
    return formatString(config, "null");
  }

  return formatString(config, "");
};

export const formatData = (
  config: ConfigOptions,
  data: AcceptedData,
): FormattedData => {
  if (typeof data === "number") {
    return formatNumber(config, data);
  }

  if (typeof data === "string") {
    return formatString(config, data);
  }

  if (typeof data === "boolean" && config.boolDisplay) {
    return formatBoolean(config, data);
  }

  if (data === null || typeof data === "undefined") {
    return formatNullish(config, data);
  }

  throw new UnsupportedDataFormatError(
    `
    typeof ${typeof data} isn't supported. Only number, string, boolean, null and undefined are supported.
    Please convert the data in your object to one of those before generating the CSV.
    `,
  );
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
