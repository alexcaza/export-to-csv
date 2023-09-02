import { WithDefaults, ConfigOptions } from "./types";

const defaults: WithDefaults<ConfigOptions> = {
  fieldSeparator: ",",
  decimalSeparator: ".",
  quoteStrings: '"',
  showTitle: false,
  title: "My Generated Report",
  filename: "generated",
  showColumnHeaders: true,
  useTextFile: false,
  useBom: true,
  columnHeaders: [],
  useKeysAsHeaders: false,
};

export const endOfLine = "\r\n";
export const byteOrderMark = "\ufeff";

export const mkConfig: (opts: ConfigOptions) => WithDefaults<ConfigOptions> = (
  opts,
) => Object.assign({}, defaults, opts);
