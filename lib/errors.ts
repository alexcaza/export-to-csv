export class CsvGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CsvGenerationError";
  }
}

export class EmptyHeadersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmptyHeadersError";
  }
}

export class CsvDownloadEnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CsvDownloadEnvironmentError";
  }
}

export class UnsupportedDataFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedDataFormatError";
  }
}
