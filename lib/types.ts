export type Newtype<URI, A> = {
  readonly _URI: URI;
  readonly _A: A;
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

export interface CsvOutput
  extends Newtype<{ readonly CsvOutput: unique symbol }, string> {}

export type CsvRow = Newtype<{ readonly CsvRow: unique symbol }, string>;

export type IO = void;
