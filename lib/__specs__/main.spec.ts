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
  },
  {
    name: "Test 2",
    age: 11,
    average: 8.2,
    approved: true,
    description: "Test 2 description",
  },
  {
    name: "Test 4",
    age: 10,
    average: 8.2,
    approved: true,
    description: "Test 3 description",
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

    const mockDataKeys = Object.keys(mockData[0]);
    expect(keys).toEqual(mockDataKeys);
  });

  it("should retain order of headers when given as option", () => {
    const options: ConfigOptions = {
      filename: "Test Csv 2",
      useBom: true,
      showColumnHeaders: true,
      columnHeaders: ["name", "average", "age", "approved", "description"],
    };

    const withDefaults = mkConfig(options);

    const output = generateCsv(options)(mockData);

    const firstLine = unpack(output).split("\n")[0];
    const keys = firstLine.split(",").map((s: string) => s.trim());

    expect(keys).toEqual(withDefaults.columnHeaders);
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

    const mockDataKeys = Object.keys(mockData[0]);
    expect(keys).toEqual(mockDataKeys);
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

    expect(keys).toEqual(["name", "age"]);
  });
});
