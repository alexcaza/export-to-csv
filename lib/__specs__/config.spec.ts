import { describe, expect, it } from "bun:test";
import { defaults, mkConfig } from "../config";

describe("mkConfig", () => {
  it("should properly set defaults when empty", () => {
    const config = mkConfig({});
    expect(config).toEqual(defaults);
  });

  it("should properly allow user overrides", () => {
    const config = mkConfig({ filename: "test csv" });
    const overrides = {
      ...defaults,
      filename: "test csv",
    };
    expect(config).toEqual(overrides);
  });
});
