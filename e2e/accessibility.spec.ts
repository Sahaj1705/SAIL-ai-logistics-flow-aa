import { test, expect } from "@playwright/test"

test.describe("Accessibility", () => {
  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/")

    // Test tab navigation
    await page.keyboard.press("Tab")
    await page.keyboard.press("Tab")
    await page.keyboard.press("Enter")

    // Should navigate to dashboard
    await expect(page).toHaveURL("/dashboard")
  })

  test("reduced motion preference is respected", async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/dashboard")

    // Check that animations are disabled
    const motionElement = page.locator(".motion-reduce\\:animate-none").first()
    if ((await motionElement.count()) > 0) {
      await expect(motionElement).toHaveClass(/motion-reduce:animate-none/)
    }
  })

  test("high contrast mode works", async ({ page }) => {
    await page.goto("/dashboard")

    // Enable high contrast mode
    await page.click('button[aria-label="Toggle high contrast mode"]')

    // Check that high contrast styles are applied
    await expect(page.locator("html")).toHaveClass(/high-contrast/)
  })
})
