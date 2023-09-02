export type Newtype<T> = {
  readonly __tag: symbol;
  value: T;
};

export type WithDefaults<T> = Required<T>;

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

export type CsvOutput = Newtype<string>;

export type IO = void;
