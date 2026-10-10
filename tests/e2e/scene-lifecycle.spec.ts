import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`scene overlays survive resize and client navigation at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    for (let visit = 0; visit < 3; visit++) {
      await expect(
        page.getByRole("button", { name: "Explore the village", exact: true }),
      ).toBeEnabled({ timeout: 45000 });
      await expect(page.locator(".building-seal").first()).toBeAttached();
      await expect(page.locator(".world-label")).toHaveCount(5);
      await page.setViewportSize({ width: width - 30, height: 740 });
      await page.setViewportSize({ width, height: 844 });
      await page.locator(".standard-link").click();
      await expect(page).toHaveURL(/\/portfolio$/);
      await expect(page.locator("canvas")).toHaveCount(0);
      await page.getByRole("link", { name: "← Return to the village" }).click();
      await expect(page).toHaveURL(/\/$/);
    }
    await expect(
      page.getByRole("button", { name: "Explore the village", exact: true }),
    ).toBeEnabled({ timeout: 45000 });
    // Exercise the actual projected DOM overlay, not the fixed navigation.
    await page
      .locator(".world-label")
      .filter({ hasText: "Hokage Office" })
      .click();
    await expect(
      page.getByRole("dialog").getByRole("heading", { name: "Hi, I’m Sunil." }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}
