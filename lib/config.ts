type WithDefaults<T> = Required<T>;

type ConfigOptions = {
  filename?: string;
  fieldSeparator?: string;
  quoteStrings?: string;
  decimalSeparator?: string;
  showLabels?: boolean;
  showTitle?: boolean;
  title?: string;
  useTextFile?: boolean;
  useBom?: boolean;
  headers?: Array<string>;
  useKeysAsHeaders?: boolean;
};

const defaults: WithDefaults<ConfigOptions> = {
  fieldSeparator: ",",
  decimalSeparator: ".",
  quoteStrings: '"',
  showTitle: false,
  title: "My Generated Report",
  filename: "generated",
  showLabels: false,
  useTextFile: false,
  useBom: true,
  headers: [],
  useKeysAsHeaders: false,
};

export const endOfLine = "\r\n";
export const byteOrderMark = "\ufeff";

export const mkConfig: (opts: ConfigOptions) => WithDefaults<ConfigOptions> = (
  opts,
) => Object.assign({}, opts, defaults);
