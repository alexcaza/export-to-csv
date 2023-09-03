import { test, expect } from "@playwright/test";

test("download csv file", async ({ page }) => {
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

test("download txt file", async ({ page }) => {
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
