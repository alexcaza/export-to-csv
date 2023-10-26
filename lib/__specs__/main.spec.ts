import { describe, it, expect } from "bun:test";
import { mkConfig } from "../config";
import { generateCsv } from "../generator";
import { ConfigOptions, unpack } from "../types";

const mockData = [
  {
    name: "Test 1",
    age: 13,
    average: 8.2,
    approved: true,
    description: "Test 1 description",
    quotedNumber: "01234",
  },
  {
    name: "Test 2",
    age: 11,
    average: 8.2,
    approved: true,
    description: "Test 2 description",
    quotedNumber: "05678",
  },
  {
    name: "Test 4",
    age: 10,
    average: 8.2,
    approved: true,
    description: "Test 3 description",
    quotedNumber: "09999",
  },
];

describe("ExportToCsv", () => {
  it("should create a comma seperated string", () => {
    const options: ConfigOptions = {
      title: "Test Csv",
      useBom: true,
      useKeysAsHeaders: true,
    };

    const string = generateCsv(options)(mockData);
    expect(typeof string === "string").toBeTruthy();
  });

  it("should use keys of first object in collection as headers", () => {
    const options: ConfigOptions = {
      title: "Test Csv",
      useBom: true,
      useKeysAsHeaders: true,
    };

    const string = generateCsv(options)(mockData);

    const firstLine = unpack(string).split("\n")[0];
    const keys = firstLine.split(",").map((s: string) => s.trim());

    expect(keys).toEqual([
      '"name"',
      '"age"',
      '"average"',
      '"approved"',
      '"description"',
      '"quotedNumber"',
    ]);
  });

  it("should retain order of headers when given as option", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: true,
      showColumnHeaders: true,
      columnHeaders: ["name", "average", "age", "approved", "description"],
    };

    const withDefaults = mkConfig(options);

    const output = generateCsv(withDefaults)(mockData);

    const firstLine = unpack(output).split("\n")[0];
    const keys = firstLine.split(",").map((s: string) => s.trim());

    expect(keys).toEqual([
      '"name"',
      '"average"',
      '"age"',
      '"approved"',
      '"description"',
    ]);
  });

  it("should only use columns in columnHeaders", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: true,
      showColumnHeaders: true,
      columnHeaders: ["name", "age"],
    };

    const output = generateCsv(options)(mockData);

    const firstLine = unpack(output).split("\n")[0];
    const keys = firstLine.split(",").map((s: string) => s.trim());

    expect(keys).toEqual(['"name"', '"age"']);
  });

  it("should allow only headers to be generated", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      columnHeaders: ["name", "age"],
    };

    const output = generateCsv(options)([]);

    expect(output).toEqual('"name","age"\r\n');
  });

  it("should throw when no data supplied", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: false,
    };

    expect(() => {
      generateCsv(options)([]);
    }).toThrow();
  });

  it("should allow null values", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      useKeysAsHeaders: true,
    };

    const output = generateCsv(options)([
      {
        "non-null": 24,
        nullish: null,
      },
    ]);

    expect(output).toBe('"non-null","nullish"\r\n24,null\r\n');
  });

  it("should convert undefined to empty string by default", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      useKeysAsHeaders: true,
    };

    const output = generateCsv(options)([
      {
        car: "toyota",
        color: "blue",
      },
      {
        car: "chevrolet",
      },
    ]);

    expect(output).toBe(
      '"car","color"\r\n"toyota","blue"\r\n"chevrolet",""\r\n',
    );
  });

  it("should handle varying data shapes by manually setting column headers", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      columnHeaders: ["car", "color", "town"],
    };

    const output = generateCsv(options)([
      {
        car: "toyota",
        color: "blue",
      },
      {
        car: "chevrolet",
      },
      {
        town: "montreal",
      },
    ]);

    expect(output).toBe(
      '"car","color","town"\r\n"toyota","blue",""\r\n"chevrolet","",""\r\n"","","montreal"\r\n',
    );
  });

  it("should escape double quotes when quote is double quote", () => {
    const options: ConfigOptions = {
      quoteCharacter: '"',
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      useKeysAsHeaders: true,
    };

    const output = generateCsv(options)([
      {
        "escape-it": 24,
        song: 'Mack "The Knife"',
      },
    ]);

    expect(output).toBe('"escape-it","song"\r\n24,"Mack ""The Knife"""\r\n');
  });

  it("should not escape double quotes when quote is not double quote", () => {
    const options: ConfigOptions = {
      quoteCharacter: "'",
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      useKeysAsHeaders: true,
    };

    const output = generateCsv(options)([
      {
        "escape-it": 24,
        song: 'Mack "The Knife"',
      },
    ]);

    expect(output).toBe("'escape-it','song'\r\n24,'Mack \"The Knife\"'\r\n");
  });

  it("should properly quote headers", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      columnHeaders: ["name", "age"],
    };

    const output = generateCsv(options)(mockData);
    const firstLine = unpack(output).split("\n")[0];

    expect(firstLine).toBe('"name","age"\r');
  });
});

describe("ExportToCsv As A Text File", () => {
  it("should create a comma seperated string", () => {
    const options: ConfigOptions = {
      title: "Test Csv 1",
      useTextFile: true,
      useBom: true,
      showColumnHeaders: true,
      useKeysAsHeaders: true,
    };

    const string = generateCsv(options)(mockData);
    expect(typeof string === "string").toBeTruthy();
  });

  it("should use keys of first object in collection as headers", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useTextFile: true,
      useBom: true,
      showColumnHeaders: true,
      useKeysAsHeaders: true,
    };

    const output = generateCsv(options)(mockData);

    const firstLine = unpack(output).split("\n")[0];
    const keys = firstLine.split(",").map((s: string) => s.trim());

    expect(keys).toEqual([
      '"name"',
      '"age"',
      '"average"',
      '"approved"',
      '"description"',
      '"quotedNumber"',
    ]);
  });

  it("should only use columns in columnHeaders", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useTextFile: true,
      useBom: true,
      showColumnHeaders: true,
      columnHeaders: ["name", "age"],
    };

    const output = generateCsv(options)(mockData);

    const firstLine = unpack(output).split("\n")[0];
    const keys = firstLine.split(",").map((s: string) => s.trim());

    expect(keys).toEqual(['"name"', '"age"']);
  });

  it("should allow only headers to be generated", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useTextFile: true,
      useBom: false,
      showColumnHeaders: true,
      columnHeaders: ["name", "age"],
    };

    const output = generateCsv(options)([]);

    expect(output).toEqual('"name","age"\r\n');
  });

  it("should throw when no data supplied", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useTextFile: true,
      useBom: false,
      showColumnHeaders: false,
    };

    expect(() => {
      generateCsv(options)([]);
    }).toThrow();
  });

  it("should allow null values", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useTextFile: true,
      useBom: false,
      showColumnHeaders: true,
      useKeysAsHeaders: true,
    };

    const output = generateCsv(options)([
      {
        "non-null": 24,
        nullish: null,
      },
    ]);

    expect(output).toBe('"non-null","nullish"\r\n24,null\r\n');
  });

  it("should convert undefined to empty string by default", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useTextFile: true,
      useBom: false,
      showColumnHeaders: true,
      useKeysAsHeaders: true,
    };

    const output = generateCsv(options)([
      {
        car: "toyota",
        color: "blue",
      },
      {
        car: "chevrolet",
      },
    ]);

    expect(output).toBe(
      '"car","color"\r\n"toyota","blue"\r\n"chevrolet",""\r\n',
    );
  });

  it("should handle varying data shapes by manually setting column headers", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useTextFile: true,
      useBom: false,
      showColumnHeaders: true,
      columnHeaders: ["car", "color", "town"],
    };

    const output = generateCsv(options)([
      {
        car: "toyota",
        color: "blue",
      },
      {
        car: "chevrolet",
      },
      {
        town: "montreal",
      },
    ]);

    expect(output).toBe(
      '"car","color","town"\r\n"toyota","blue",""\r\n"chevrolet","",""\r\n"","","montreal"\r\n',
    );
  });

  it("should properly quote headers", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useTextFile: true,
      useBom: false,
      showColumnHeaders: true,
      columnHeaders: ["name", "age"],
    };

    const output = generateCsv(options)(mockData);
    const firstLine = unpack(output).split("\n")[0];

    expect(firstLine).toBe('"name","age"\r');
  });
});
