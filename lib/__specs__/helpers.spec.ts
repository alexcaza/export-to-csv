import { describe, expect, it, jest } from "@jest/globals";
import { thread } from "../helpers";

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
});
