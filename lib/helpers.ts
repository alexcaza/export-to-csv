import { ConfigOptions } from "./config";

export type Newtype<T> = {
  readonly __tag: symbol;
  value: T;
};

export const pack = <T extends Newtype<T>>(value: T["value"]): T =>
  value as any as T;

export const unpack = <T extends Newtype<T>>(newtype: T): T["value"] =>
  newtype as any as T["value"];

const isFloat = (input: any): boolean =>
  +input === input && (!isFinite(input) || Boolean(input % 1));

export const formatData = (config: ConfigOptions, data: any): string => {
  if (config.decimalSeparator === "locale" && isFloat(data)) {
    return data.toLocaleString();
  }

  if (config.decimalSeparator !== "." && isFloat(data)) {
    return data.toString().replace(".", config.decimalSeparator);
  }

  if (typeof data === "string") {
    data = data.replace(/"/g, '""');
    if (
      config.quoteStrings ||
      data.indexOf(",") > -1 ||
      data.indexOf("\n") > -1 ||
      data.indexOf("\r") > -1
    ) {
      data = config.quoteStrings + data + config.quoteStrings;
    }
    return data;
  }

  if (typeof data === "boolean") {
    return data ? "TRUE" : "FALSE";
  }
  return data;
};
