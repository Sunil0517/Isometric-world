import { test, expect } from "@playwright/test";
test("water and surface shaders compile at every graphics quality", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Explore the village", exact: true }),
  ).toBeEnabled({ timeout: 45000 });
  for (const quality of ["low", "medium", "high", "ultra"]) {
    await page
      .getByRole("button", { name: "Open settings", exact: true })
      .click();
    await page.getByLabel("Graphics quality").selectOption(quality);
    await expect(page.getByLabel("Graphics quality")).toHaveValue(quality);
    await page
      .getByRole("button", { name: "Close panel", exact: true })
      .click();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    await page.screenshot({ path: `output/playwright/shaders-${quality}.png` });
  }
  expect(errors).toEqual([]);
});
