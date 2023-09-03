import { describe, expect, it, jest } from "@jest/globals";
import {
  addBOM,
  addBody,
  addEndOfLine,
  addFieldSeparator,
  addHeaders,
  addTitle,
  buildRow,
  thread,
} from "../helpers";
import { byteOrderMark, endOfLine, mkConfig } from "../config";
import { mkCsvOutput, mkCsvRow, unpack } from "../types";
import { EmptyHeadersError } from "../errors";

describe("Helpers", () => {
  describe("thread", () => {
    it("should call each function", () => {
      const val = "";
      const one = jest.fn();
      const two = jest.fn();
      const three = jest.fn();

      thread(val, one, two, three);

      expect(one).toHaveBeenCalled();
      expect(two).toHaveBeenCalled();
      expect(three).toHaveBeenCalled();
    });

    it("should call each function with initial value", () => {
      const val = "test";
      const one = jest.fn((x) => x);
      const two = jest.fn((x) => x);
      const three = jest.fn((x) => x);

      thread(val, one, two, three);

      expect(one.mock.results[0].value).toBe(val);
      expect(two.mock.results[0].value).toBe(val);
      expect(three.mock.results[0].value).toBe(val);
    });
  });

  describe("addBom", () => {
    it("should add a byte order mark to input if set to true", () => {
      const config = mkConfig({ useBom: true });
      const input = mkCsvOutput("test");
      const output = addBOM(config)(input);

      expect(output).toBe(input + byteOrderMark);
    });

    it("should return input unchanged if set to false", () => {
      const config = mkConfig({ useBom: false });
      const input = mkCsvOutput("test");
      const output = addBOM(config)(input);

      expect(output).toBe(input);
    });
  });

  describe("addTitle", () => {
    it("should add title if set to true", () => {
      const config = mkConfig({ showTitle: true, title: "My title" });
      const input = mkCsvOutput("");
      const output = addTitle(config)(input);

      expect(output).toBe("My title");
    });

    it("should add use default if set to true without title given", () => {
      const config = mkConfig({ showTitle: true });
      const input = mkCsvOutput("");
      const output = addTitle(config)(input);

      expect(output).toBe("My Generated Report");
    });

    it("should skip title if set to false", () => {
      const config = mkConfig({ showTitle: false, title: "My title" });
      const input = mkCsvOutput("");
      const output = addTitle(config)(input);

      expect(output).toBe("");
    });
  });

  describe("addEndOfLine", () => {
    it("should add new lines to end of row", () => {
      const csv = mkCsvOutput("");
      const input = mkCsvRow("test,one,two");
      const output = addEndOfLine(csv)(input);

      expect(output).toBe(unpack(csv) + unpack(input) + endOfLine);
    });
  });

  describe("addFieldSeparator", () => {
    it("should add field separator to input with defaults", () => {
      const config = mkConfig({});
      const input = mkCsvRow("test,one,two");
      const output = addFieldSeparator(config)(input);

      expect(output).toBe(input + ",");
    });

    it("should add field separator to input based on config option", () => {
      const config = mkConfig({ fieldSeparator: "|" });
      const input = mkCsvRow("test|one|two");
      const output = addFieldSeparator(config)(input);

      expect(output).toBe(input + "|");
    });
  });

  describe("buildRow", () => {
    it("should add item to row", () => {
      const config = mkConfig({});
      const input = mkCsvRow("test,one,two,");
      const output = buildRow(config)(input, "house");

      expect(output).toBe("test,one,two,house,");
    });
  });

  describe("addHeaders", () => {
    describe("throw error if showColumnHeaders true but headers empty", () => {
      it("should throw when useKeysAsHeaders is true", () => {
        const config = mkConfig({
          showColumnHeaders: true,
          useKeysAsHeaders: true,
        });
        expect(() => addHeaders(config, [])(mkCsvOutput(""))).toThrowError(
          EmptyHeadersError,
        );
      });

      it("should throw when headers supplied but empty", () => {
        const config = mkConfig({
          showColumnHeaders: true,
          useKeysAsHeaders: false,
        });
        expect(() => addHeaders(config, [])(mkCsvOutput(""))).toThrowError(
          EmptyHeadersError,
        );
      });
    });

    describe("build headers based on input", () => {
      it("should retain order", () => {
        const config = mkConfig({
          showColumnHeaders: true,
        });
        const nameAndDate = addHeaders(config, ["name", "date"])(
          mkCsvOutput(""),
        );
        expect(nameAndDate).toEqual("name,date" + endOfLine);

        const dateAndCity = addHeaders(config, ["date", "city"])(
          mkCsvOutput(""),
        );
        expect(dateAndCity).toEqual("date,city" + endOfLine);
      });
    });
  });

  describe("addBody", () => {
    it("should build csv body", () => {
      const config = mkConfig({});
      const nameAndDate = addBody(
        config,
        ["name", "date"],
        [{ name: "rouky", date: "2023-09-02" }],
      )(mkCsvOutput(""));
      expect(nameAndDate).toEqual('"rouky","2023-09-02"' + endOfLine);
    });

    // TODO: Properly test various formatting cases present in formatData
  });
});
