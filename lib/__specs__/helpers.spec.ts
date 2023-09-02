import { thread } from "../helpers";

describe("Helpers", () => {
  describe("thread", () => {
    it("should call each function", () => {
      const val = "";
      const one = () => {};
      const two = () => {};
      const three = () => {};

      thread(val, one, two, three);

      expect(one).toHaveBeenCalled();
      expect(two).toHaveBeenCalled();
      expect(three).toHaveBeenCalled();
    });
    it("should call each function with initial value", () => {
      const val = "test";
      const one = jasmine.createSpy();
      const two = jasmine.createSpy();
      const three = jasmine.createSpy();

      thread(val, one, two, three);

      expect(one).toHaveBeenCalledOnceWith();
      expect(two).toHaveBeenCalledOnceWith();
      expect(three).toHaveBeenCalledOnceWith();
    });
  });
});
