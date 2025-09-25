import { test, expect } from "@playwright/test"

test.describe("Optimization Engine", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/optimize")
  })

  test("optimization form works", async ({ page }) => {
    // Fill out optimization parameters
    await page.selectOption('select[name="objective"]', "least-cost")
    await page.fill('input[name="cargo-amount"]', "1000")

    // Start optimization
    await page.click('button:has-text("Start Optimization")')

    // Check for optimization results
    await expect(page.getByText("Optimization Results")).toBeVisible({ timeout: 10000 })
  })

  test("scenario comparison works", async ({ page }) => {
    // Create two scenarios
    await page.click('button:has-text("Add Scenario")')
    await page.fill('input[placeholder="Scenario name"]', "Test Scenario 1")

    await page.click('button:has-text("Add Scenario")')
    await page.fill('input[placeholder="Scenario name"]', "Test Scenario 2")

    // Compare scenarios
    await page.click('button:has-text("Compare Scenarios")')
    await expect(page.getByText("Scenario Comparison")).toBeVisible()
  })
})
