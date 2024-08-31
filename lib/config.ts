import { WithDefaults, ConfigOptions, MediaType } from "./types.ts";

export const defaults: WithDefaults<ConfigOptions> = {
  fieldSeparator: ",",
  decimalSeparator: ".",
  quoteStrings: true,
  quoteCharacter: '"',
  showTitle: false,
  title: "My Generated Report",
  filename: "generated",
  showColumnHeaders: true,
  useTextFile: false,
  fileExtension: "csv",
  mediaType: MediaType.csv,
  useBom: true,
  columnHeaders: [],
  useKeysAsHeaders: false,
  boolDisplay: { true: "TRUE", false: "FALSE" },
  replaceUndefinedWith: "",
};

export const endOfLine = "\r\n";
export const byteOrderMark = "\ufeff";

export const mkConfig: (opts: ConfigOptions) => WithDefaults<ConfigOptions> = (
  opts,
) => Object.assign({}, defaults, opts);
