import { test, expect } from "@playwright/test";

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
