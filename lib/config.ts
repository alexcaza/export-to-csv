type WithDefaults<T> = Required<T>;

export type ConfigOptions = {
  filename?: string;
  fieldSeparator?: string;
  quoteStrings?: string;
  decimalSeparator?: string;
  showColumnHeaders?: boolean;
  showTitle?: boolean;
  title?: string;
  useTextFile?: boolean;
  useBom?: boolean;
  columnHeaders?: Array<string>;
  useKeysAsHeaders?: boolean;
};

const defaults: WithDefaults<ConfigOptions> = {
  fieldSeparator: ",",
  decimalSeparator: ".",
  quoteStrings: '"',
  showTitle: false,
  title: "My Generated Report",
  filename: "generated",
  showColumnHeaders: false,
  useTextFile: false,
  useBom: true,
  columnHeaders: [],
  useKeysAsHeaders: false,
};

export const endOfLine = "\r\n";
export const byteOrderMark = "\ufeff";

export const mkConfig: (opts: ConfigOptions) => WithDefaults<ConfigOptions> = (
  opts,
) => Object.assign({}, opts, defaults);
