import { describe, expect, it, jest } from "bun:test";
import {
  addBOM,
  addBody,
  addEndOfLine,
  addFieldSeparator,
  addHeaders,
  addTitle,
  asString,
  buildRow,
  formatData,
  thread,
} from "../helpers.ts";
import { byteOrderMark, endOfLine, mkConfig } from "../config.ts";
import { mkCsvOutput, mkCsvRow, unpack } from "../types.ts";

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
      const output = asString(addBOM(config)(input));

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
      const output = asString(addTitle(config)(input));

      expect(output).toBe("My title\r\n");
    });

    it("should add use default if set to true without title given", () => {
      const config = mkConfig({ showTitle: true });
      const input = mkCsvOutput("");
      const output = asString(addTitle(config)(input));

      expect(output).toBe("My Generated Report\r\n");
    });

    it("should skip title if set to false", () => {
      const config = mkConfig({ showTitle: false, title: "My title" });
      const input = mkCsvOutput("");
      const output = asString(addTitle(config)(input));

      expect(output).toBe("");
    });
  });

  describe("addEndOfLine", () => {
    it("should add new lines to end of row", () => {
      const csv = mkCsvOutput("");
      const input = mkCsvRow("test,one,two");
      const output = asString(addEndOfLine(csv)(input));

      expect(output).toBe(unpack(csv) + unpack(input) + endOfLine);
    });
  });

  describe("addFieldSeparator", () => {
    it("should add field separator to input with defaults", () => {
      const config = mkConfig({});
      const input = mkCsvRow("test,one,two");
      const output = addFieldSeparator(config)(input);

      expect(output).toBe(mkCsvRow(asString(input) + ","));
    });

    it("should add field separator to input based on config option", () => {
      const config = mkConfig({ fieldSeparator: "|" });
      const input = mkCsvRow("test|one|two");
      const output = addFieldSeparator(config)(input);

      expect(output).toBe(mkCsvRow(asString(input) + "|"));
    });
  });

  describe("buildRow", () => {
    it("should add item to row", () => {
      const config = mkConfig({});
      const input = mkCsvRow("test,one,two,");
      const output = asString(buildRow(config)(input, "house"));

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
        expect(() => addHeaders(config, [])(mkCsvOutput(""))).toThrow();
      });

      it("should throw when headers supplied but empty", () => {
        const config = mkConfig({
          showColumnHeaders: true,
          useKeysAsHeaders: false,
        });
        expect(() => addHeaders(config, [])(mkCsvOutput(""))).toThrow();
      });
    });

    describe("build headers based on input", () => {
      it("should retain order", () => {
        const config = mkConfig({
          showColumnHeaders: true,
        });
        const nameAndDate = asString(
          addHeaders(config, ["name", "date"])(mkCsvOutput("")),
        );
        expect(nameAndDate).toEqual('"name","date"' + endOfLine);

        const dateAndCity = asString(
          addHeaders(config, ["date", "city"])(mkCsvOutput("")),
        );
        expect(dateAndCity).toEqual('"date","city"' + endOfLine);
      });
    });

    describe("pretty header mappings", () => {
      it("should allow columnHeaders to contain objects with a display label", () => {
        const config = mkConfig({
          columnHeaders: ["name", { key: "date", displayLabel: "Date" }],
        });
        const nameAndDate = asString(
          addHeaders(config, ["name", { key: "date", displayLabel: "Date" }])(
            mkCsvOutput(""),
          ),
        );
        expect(nameAndDate).toEqual('"name","Date"' + endOfLine);
      });
    });
  });

  describe("addBody", () => {
    it("should build csv body", () => {
      const config = mkConfig({});
      const nameAndDate = asString(
        addBody(
          config,
          ["name", "date"],
          [{ name: "rouky", date: "2023-09-02" }],
        )(mkCsvOutput("")),
      );
      expect(nameAndDate).toEqual('"rouky","2023-09-02"' + endOfLine);
    });

    it("should build csv body with pretty headers", () => {
      const config = mkConfig({});
      const nameAndDate = asString(
        addBody(
          config,
          ["name", { key: "date", displayLabel: "Date" }],
          [{ name: "rouky", date: "2023-09-02" }],
        )(mkCsvOutput("")),
      );
      expect(nameAndDate).toEqual('"rouky","2023-09-02"' + endOfLine);
    });
  });

  describe("formatData", () => {
    it("should use locale string for decimals if config set", () => {
      const config = mkConfig({
        decimalSeparator: "locale",
      });
      const formatted = formatData(config, 0.6);
      expect(formatted).toEqual((0.6).toLocaleString());
    });

    it("should use custom decimal separator if set", () => {
      const config = mkConfig({
        decimalSeparator: "|",
      });
      const formatted = formatData(config, 0.6);
      expect(formatted).toEqual("0|6");
    });

    it("should properly quote strings that may conflict with generation", () => {
      // Default case should quote stings
      let config = mkConfig({});
      const defaultQuote = formatData(config, "test");
      expect(defaultQuote).toEqual('"test"');

      // Use custom quote strings
      config = mkConfig({ quoteCharacter: "^" });
      const customQuotes = formatData(config, "test");
      expect(customQuotes).toEqual("^test^");

      // Disable quoting strings
      config = mkConfig({ quoteStrings: false });
      const disableQuotes = formatData(config, "test");
      expect(disableQuotes).toEqual("test");
    });

    describe("force quote problem characters", () => {
      it("should wrap problem data in quoteStrings", () => {
        // Quote field separator
        let config = mkConfig({ quoteStrings: false });
        const customQuote = formatData(config, ",");
        expect(customQuote).toEqual('","');

        // Wrap new line
        config = mkConfig({ quoteStrings: false });
        const wrapNewLine = formatData(config, "test\n");
        expect(wrapNewLine).toEqual('"test\n"');

        // Wrap carrage return
        config = mkConfig({ quoteStrings: false });
        const wrapCR = formatData(config, "test\r");
        expect(wrapCR).toEqual('"test\r"');

        // Force quote with custom character
        config = mkConfig({ quoteStrings: false, quoteCharacter: "|" });
        const wrapCRWithCustom = formatData(config, "test\r");
        expect(wrapCRWithCustom).toEqual("|test\r|");
      });
    });
  });
});
