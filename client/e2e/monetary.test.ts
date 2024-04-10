import { test, expect } from '@playwright/test'

test.describe('Material Loan tests', () => {
  test.beforeEach(async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/login')
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' })

    // When (ACT)
    const form = page.getByRole('form', { name: 'Login' })
    await form.locator('input[type="email"]').fill('admin@example.com')
    await form.locator('input[type="password"]').fill('admin123')
    await form.locator('button[type="submit"]').click()

    // Then (ASSERT)
    await expect(dashboardLink).toBeHidden()
  })

  test.skip('Admin can see an over all monetary', async ({ page }) => {
    await page.goto('dashboard/monetary')

    await expect(page.getByTestId('overall-monetary')).toBeVisible({ timeout: 30000 })
  })
})
