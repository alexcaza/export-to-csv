import { describe, it, expect } from "bun:test";
import { mkConfig } from "../config.ts";
import { asBlob, generateCsv } from "../generator.ts";
import { ConfigOptions, MediaType } from "../types.ts";
import { asString } from "../helpers.ts";

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

    const string = asString(generateCsv(options)(mockData));
    expect(typeof string === "string").toBeTruthy();
  });

  it("should allow keys with spaces", () => {
    const mockDataOne = [
      {
        "Hello world": "test",
        "this is another string with many spaces": 10,
      },
    ];

    const optionsOne = mkConfig({ useBom: false, useKeysAsHeaders: true });
    const stringOne = asString(generateCsv(optionsOne)(mockDataOne));
    expect(stringOne).toEqual(
      '"Hello world","this is another string with many spaces"\r\n"test",10\r\n',
    );

    const mockDataTwo = [
      {
        "Hello world": "test",
        "this is another string with many spaces": 10,
      },
    ];

    const optionsTwo = mkConfig({
      useBom: false,
      showColumnHeaders: true,
      columnHeaders: ["Hello world", "this is another string with many spaces"],
    });
    const stringTwo = asString(generateCsv(optionsTwo)(mockDataTwo));
    expect(stringTwo).toEqual(
      '"Hello world","this is another string with many spaces"\r\n"test",10\r\n',
    );
  });

  it("should use fieldSeparator if supplied", () => {
    const options: ConfigOptions = {
      title: "Test Csv",
      useBom: false,
      useKeysAsHeaders: true,
      fieldSeparator: ";",
    };

    const string = asString(generateCsv(options)([{ test: "hello" }]));
    expect(string).toEqual('"test"\r\n"hello"\r\n');
  });

  it("should use keys of first object in collection as headers", () => {
    const options: ConfigOptions = {
      title: "Test Csv",
      useBom: true,
      useKeysAsHeaders: true,
    };

    const string = asString(generateCsv(options)(mockData));

    const firstLine = string.split("\n")[0];
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

    const output = asString(generateCsv(withDefaults)(mockData));

    const firstLine = output.split("\n")[0];
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

    const output = asString(generateCsv(options)(mockData));

    const firstLine = output.split("\n")[0];
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

    const output = asString(generateCsv(options)([]));

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

    const output = asString(
      generateCsv(options)([
        {
          "non-null": 24,
          nullish: null,
        },
      ]),
    );

    expect(output).toBe('"non-null","nullish"\r\n24,"null"\r\n');
  });

  it("should convert undefined to empty string by default", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      useKeysAsHeaders: true,
    };

    const output = asString(
      generateCsv(options)([
        {
          car: "toyota",
          color: "blue",
        },
        {
          car: "chevrolet",
        },
      ]),
    );

    expect(output).toBe(
      '"car","color"\r\n"toyota","blue"\r\n"chevrolet",""\r\n',
    );
  });

  it("should replace undefined with specified value", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      useKeysAsHeaders: true,
      replaceUndefinedWith: "TEST",
    };

    const output = asString(
      generateCsv(options)([
        {
          car: "toyota",
          color: "blue",
        },
        {
          car: "chevrolet",
        },
      ]),
    );

    expect(output).toBe(
      '"car","color"\r\n"toyota","blue"\r\n"chevrolet","TEST"\r\n',
    );
  });

  it("should handle varying data shapes by manually setting column headers", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      columnHeaders: ["car", "color", "town"],
    };

    const output = asString(
      generateCsv(options)([
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
      ]),
    );

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

    const output = asString(
      generateCsv(options)([
        {
          "escape-it": 24,
          song: 'Mack "The Knife"',
        },
      ]),
    );

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

    const output = asString(
      generateCsv(options)([
        {
          "escape-it": 24,
          song: 'Mack "The Knife"',
        },
      ]),
    );

    expect(output).toBe("'escape-it','song'\r\n24,'Mack \"The Knife\"'\r\n");
  });

  it("should properly quote headers", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: false,
      showColumnHeaders: true,
      columnHeaders: ["name", "age"],
    };

    const output = asString(generateCsv(options)(mockData));
    const firstLine = output.split("\n")[0];

    expect(firstLine).toBe('"name","age"\r');
  });

  it("should put the title on the first line", () => {
    const options: ConfigOptions = {
      title: "Test Csv 2",
      showTitle: true,
      useBom: false,
      showColumnHeaders: true,
      columnHeaders: ["name", "age"],
    };

    const output = asString(generateCsv(options)(mockData));
    const firstLine = output.split("\n")[0];

    expect(firstLine).toBe("Test Csv 2\r");
  });

  it("should allow for custom file extensions", () => {
    const csvOpts: ConfigOptions = {
      mediaType: MediaType.csv,
    };
    const csvConf = mkConfig(csvOpts);

    const txtOpts: ConfigOptions = {
      mediaType: MediaType.plain,
    };
    const txtConf = mkConfig(txtOpts);

    const tsvOpts: ConfigOptions = {
      mediaType: MediaType.tsv,
    };
    const tsvConf = mkConfig(tsvOpts);

    expect(csvConf.mediaType).toBe(MediaType.csv);
    expect(txtConf.mediaType).toBe(MediaType.plain);
    expect(tsvConf.mediaType).toBe(MediaType.tsv);
  });

  describe("asBlob", () => {
    it("should construct a valid blob based on options", async () => {
      const options: ConfigOptions = {
        title: "Test Csv 2",
        showTitle: true,
        useBom: false,
        showColumnHeaders: true,
        columnHeaders: ["name", "age"],
      };

      const output = generateCsv(options)(mockData);
      const blob = asBlob(options)(output);
      const text = await blob.text();

      expect(blob.type).toBe("text/csv;charset=utf8;");
      expect(text.split("\n")[0]).toBe("Test Csv 2\r");
      expect(blob.size).toBe(65);
    });
  });
});
