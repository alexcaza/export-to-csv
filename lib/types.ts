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
  boolDisplay?: { true: string; false: string };
};

export interface CsvOutput
  extends Newtype<{ readonly CsvOutput: unique symbol }, string> {}

export type CsvRow = Newtype<{ readonly CsvRow: unique symbol }, string>;

export type IO = void;

export const pack = <T extends Newtype<any, any>>(value: T["_A"]): T =>
  value as any as T;

export const unpack = <T extends Newtype<any, any>>(newtype: T): T["_A"] =>
  newtype as any as T["_A"];

export const mkCsvOutput = pack<CsvOutput>;
export const mkCsvRow = pack<CsvRow>;
