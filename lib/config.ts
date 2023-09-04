import { WithDefaults, ConfigOptions } from "./types";

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
  useBom: true,
  columnHeaders: [],
  useKeysAsHeaders: false,
  boolDisplay: { true: "TRUE", false: "FALSE" },
};

export const endOfLine = "\r\n";
export const byteOrderMark = "\ufeff";

export const mkConfig: (opts: ConfigOptions) => WithDefaults<ConfigOptions> = (
  opts,
) => Object.assign({}, defaults, opts);
