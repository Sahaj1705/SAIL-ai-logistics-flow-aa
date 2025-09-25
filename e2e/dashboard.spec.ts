import { test, expect } from "@playwright/test"

test.describe("Dashboard Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard")
  })

  test("displays main dashboard elements", async ({ page }) => {
    // Check for key dashboard components
    await expect(page.getByText("AI Logistics Dashboard")).toBeVisible()
    await expect(page.getByText("Active Vessels")).toBeVisible()
    await expect(page.getByText("Port Congestion")).toBeVisible()
    await expect(page.getByText("Avg Delay")).toBeVisible()
    await expect(page.getByText("Cost Efficiency")).toBeVisible()
  })

  test("navigation works correctly", async ({ page }) => {
    // Test navigation to different sections
    await page.click("text=Optimize")
    await expect(page).toHaveURL("/optimize")

    await page.click("text=Scheduler")
    await expect(page).toHaveURL("/scheduler")

    await page.click("text=Port Plant")
    await expect(page).toHaveURL("/port-plant")
  })

  test("charts render without errors", async ({ page }) => {
    // Wait for charts to load
    await page.waitForSelector('[data-testid="line-chart"]', { timeout: 10000 })
    await page.waitForSelector('[data-testid="pie-chart"]', { timeout: 10000 })

    // Check that charts are visible
    const lineChart = page.locator('[data-testid="line-chart"]')
    const pieChart = page.locator('[data-testid="pie-chart"]')

    await expect(lineChart).toBeVisible()
    await expect(pieChart).toBeVisible()
  })

  test("responsive design works", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText("AI Logistics Dashboard")).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText("AI Logistics Dashboard")).toBeVisible()
  })
})
