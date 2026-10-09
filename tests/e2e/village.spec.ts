import { test, expect } from "@playwright/test";
test("portfolio sections, filtering, focus, map, and fallback", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Thoughtful code. A curious spirit." }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Portfolio navigation" })
    .getByRole("button", { name: "Projects", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "The Forge" }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Botanical", exact: true }),
  ).toBeVisible();
  await dialog
    .getByRole("button", { name: "Applications", exact: true })
    .click();
  await expect(
    dialog.getByRole("heading", { name: "Daylight", exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Botanical", exact: true }),
  ).toHaveCount(0);
  await dialog.getByRole("button", { name: "Explore concept" }).click();
  await expect(
    dialog.getByText("A dashboard exploring everyday"),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await page.keyboard.press("m");
  await expect(
    page.getByRole("heading", { name: "Village map", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Open Forest House from map" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hi, I’m Sunil." }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Contact", exact: true })
    .click();
  await expect(
    page.getByText("An email address hasn’t been configured yet."),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/portfolio");
  await expect(
    page.getByRole("heading", { name: "Sunil Kumawat" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Selected concepts" }),
  ).toBeVisible();
});
test("playable controller moves, jumps, and pauses for panels", async ({
  page,
}) => {
  await page.goto("/");
  const start = page.getByRole("button", {
    name: "Explore the village",
    exact: true,
  });
  await expect(start).toBeEnabled({ timeout: 45000 });
  await start.click();
  const status = page.getByLabel("Player status");
  const before = Number(await status.getAttribute("data-x"));
  await page.keyboard.down("w");
  await page.waitForTimeout(1100);
  await page.keyboard.up("w");
  await expect
    .poll(async () => Number(await status.getAttribute("data-x")))
    .toBeLessThan(before - 0.5);
  await page.keyboard.press("Space");
  await expect
    .poll(() => status.getAttribute("data-state"), { timeout: 2000 })
    .toMatch(/jump|fall/);
  await expect
    .poll(() => status.getAttribute("data-state"), { timeout: 4000 })
    .toBe("idle");
  const projectsButton = page
    .getByRole("navigation")
    .getByRole("button", { name: "Projects", exact: true });
  await projectsButton.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("dialog")).toBeVisible();
  const stopped = Number(await status.getAttribute("data-x"));
  await page.keyboard.down("w");
  await page.waitForTimeout(500);
  await page.keyboard.up("w");
  expect(
    Math.abs(Number(await status.getAttribute("data-x")) - stopped),
  ).toBeLessThan(0.25);
  await page.keyboard.press("Escape");
  await expect(
    page
      .getByRole("navigation")
      .getByRole("button", { name: "Projects", exact: true }),
  ).toBeFocused();
  await page.screenshot({ path: "output/playwright/village-desktop.png" });
});
test("mobile controls and responsive panels", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Explore the village", exact: true }),
  ).toBeEnabled({ timeout: 45000 });
  await page.screenshot({ path: "output/playwright/village-mobile.png" });
  await page
    .getByRole("button", { name: "Explore the village", exact: true })
    .click();
  await expect(
    page.getByRole("group", { name: "Movement joystick" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Jump", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Toggle portfolio menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Skills", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "The Library" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("buildings block movement and proximity E opens the correct landmark", async ({
  page,
}) => {
  await page.goto("/");
  const start = page.getByRole("button", {
    name: "Explore the village",
    exact: true,
  });
  await expect(start).toBeEnabled({ timeout: 45000 });
  await start.click();
  const status = page.getByLabel("Player status");
  await page.keyboard.down("w");
  await page.keyboard.down("a");
  await expect
    .poll(async () => Number(await status.getAttribute("data-x")), {
      timeout: 12000,
    })
    .toBeLessThan(-8.2);
  await page.waitForTimeout(500);
  await page.keyboard.up("w");
  await page.keyboard.up("a");
  const x = Number(await status.getAttribute("data-x"));
  expect(x).toBeGreaterThan(-8.7);
  expect(x).toBeLessThan(-7.5);
  expect(Number(await status.getAttribute("data-y"))).toBeGreaterThan(0.65);
  await page.keyboard.press("e");
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "The Library" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.keyboard.press("Space");
  await expect
    .poll(async () => Number(await status.getAttribute("data-y")), {
      timeout: 2000,
    })
    .toBeGreaterThan(1.2);
  await expect
    .poll(() => status.getAttribute("data-state"), { timeout: 4000 })
    .toBe("idle");
  expect(Number(await status.getAttribute("data-y"))).toBeGreaterThan(0.65);
});

test("standard portfolio is readable with JavaScript disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/portfolio");
  await expect(
    page.getByRole("heading", { name: "Sunil Kumawat", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Botanical", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Experience", exact: true }),
  ).toBeVisible();
  await context.close();
});

test("jungle trial enters the arena with hearts and gems, then returns home", async ({
  page,
}) => {
  await page.goto("/");
  const start = page.getByRole("button", {
    name: "Explore the village",
    exact: true,
  });
  await expect(start).toBeEnabled({ timeout: 45000 });
  await start.click();
  const status = page.getByLabel("Player status");
  await page.getByRole("button", { name: /Adventure journal/ }).click();
  await page.getByRole("button", { name: /Jungle trial/ }).click();
  await page.getByRole("button", { name: "Begin" }).click();
  await expect(page.getByRole("img", { name: "5 of 5 hearts" })).toBeVisible();
  await expect(page.getByLabel("Gems collected")).toContainText("0");
  // The trial runs on its own river arena, far east of the village island.
  await expect
    .poll(async () => Number(await status.getAttribute("data-x")), {
      timeout: 15000,
    })
    .toBeGreaterThan(90);
  await page.getByRole("button", { name: "Exit", exact: true }).click();
  await expect
    .poll(async () => Number(await status.getAttribute("data-x")), {
      timeout: 15000,
    })
    .toBeLessThan(0);
});
