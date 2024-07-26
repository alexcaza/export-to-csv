export type Newtype<URI, A> = {
  readonly _URI: URI;
  readonly _A: A;
};

export type WithDefaults<T> = Required<T>;

export type ColumnHeader = string | { key: string; displayLabel: string };

export type ConfigOptions = {
  filename?: string;
  fieldSeparator?: string;
  quoteStrings?: boolean;
  quoteCharacter?: string;
  decimalSeparator?: string;
  showColumnHeaders?: boolean;
  showTitle?: boolean;
  title?: string;
  useTextFile?: boolean;
  fileExtension?: string;
  useBom?: boolean;
  columnHeaders?: Array<ColumnHeader>;
  useKeysAsHeaders?: boolean;
  boolDisplay?: { true: string; false: string };
  replaceUndefinedWith?: string | boolean | null;
};

export type HeaderKey = Newtype<{ readonly HeaderKey: unique symbol }, string>;

export type HeaderDisplayLabel = Newtype<
  { readonly HeaderDisplayLabel: unique symbol },
  string
>;

export type AcceptedData = number | string | boolean | null | undefined;
export type FormattedData = Newtype<
  { readonly FormattedData: unique symbol },
  string
>;

export type CsvOutput = Newtype<{ readonly CsvOutput: unique symbol }, string>;

export type CsvRow = Newtype<{ readonly CsvRow: unique symbol }, string>;

export type IO = void;

export const pack = <T extends Newtype<any, any>>(value: T["_A"]): T =>
  value as any as T;

export const unpack = <T extends Newtype<any, any>>(newtype: T): T["_A"] =>
  newtype as any as T["_A"];

export const mkFormattedData = pack<FormattedData>;
export const mkCsvOutput = pack<CsvOutput>;
export const mkCsvRow = pack<CsvRow>;
export const mkHeaderKey = pack<HeaderKey>;
export const mkHeaderDisplayLabel = pack<HeaderDisplayLabel>;
