import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

test("download csv file (default filename)", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");

  const [download] = await Promise.all([
    // Start waiting for the download
    page.waitForEvent("download"),
    // Perform the action that initiates download
    page.locator("button#csv").click(),
  ]);

  // assert filename
  expect(download.suggestedFilename()).toBe("generated.csv");
});

test("download csv file (custom filename)", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");

  const [download] = await Promise.all([
    // Start waiting for the download
    page.waitForEvent("download"),
    // Perform the action that initiates download
    page.locator("button#csv-custom").click(),
  ]);

  // assert filename
  expect(download.suggestedFilename()).toBe("Best CSV.csv");
});

test("download txt file (default filename)", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");

  const [download] = await Promise.all([
    // Start waiting for the download
    page.waitForEvent("download"),
    // Perform the action that initiates download
    page.locator("button#txt").click(),
  ]);

  // assert filename
  expect(download.suggestedFilename()).toBe("generated.txt");
});

test("download txt file (custom filename)", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");

  const [download] = await Promise.all([
    // Start waiting for the download
    page.waitForEvent("download"),
    // Perform the action that initiates download
    page.locator("button#txt-custom").click(),
  ]);

  // assert filename
  expect(download.suggestedFilename()).toBe("Best CSV as Text.txt");
});

test("download tsv file (default filename)", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");

  const [download] = await Promise.all([
    // Start waiting for the download
    page.waitForEvent("download"),
    // Perform the action that initiates download
    page.locator("button#tsv").click(),
  ]);

  // assert filename
  expect(download.suggestedFilename()).toBe("generated.txt");
});

test("download tsv file (custom filename and extension)", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");

  const [download] = await Promise.all([
    // Start waiting for the download
    page.waitForEvent("download"),
    // Perform the action that initiates download
    page.locator("button#tsv-custom").click(),
  ]);

  // assert filename
  expect(download.suggestedFilename()).toBe("Best CSV as TSV.tsv");
});

test("download csv file with escapeFormulas prefixes formula-triggering values", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:3000");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("button#csv-escape-formulas").click(),
  ]);

  expect(download.suggestedFilename()).toBe("Best CSV Escaped Formulas.csv");

  const path = await download.path();
  const content = readFileSync(path, "utf-8");

  expect(content).toContain('"\'=1+2"');
  expect(content).toContain("\"'+cmd|' /C calc'!A0\"");
  expect(content).toContain('"\'-2+3"');
  expect(content).toContain('"\'@SUM(A1:A2)"');

  // Should not contain the raw, unescaped formulas
  expect(content).not.toContain('"=1+2"');
  expect(content).not.toContain('"-2+3"');
  expect(content).not.toContain('"@SUM(A1:A2)"');
});

test("download csv file without escapeFormulas leaves formula-triggering values untouched", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:3000");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("button#csv-no-escape-formulas").click(),
  ]);

  expect(download.suggestedFilename()).toBe("Best CSV Unescaped Formulas.csv");

  const path = await download.path();
  const content = readFileSync(path, "utf-8");

  expect(content).toContain('"=1+2"');
  expect(content).toContain('"-2+3"');
  expect(content).toContain('"@SUM(A1:A2)"');
});
