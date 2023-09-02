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
