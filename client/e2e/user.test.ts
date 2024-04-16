import { test, expect } from '@playwright/test'
import path = require('path')
import { fakeUser } from 'utils/fakeData'

const { email, password, firstName, lastName, age } = fakeUser()

// We are grouping these tests in a serial block to clearly
// indicate that these tests should be run in the provided order.
// However, ideally we would like to run each test in isolation.
// That would allow us to develop faster and to see more clearly
// which part of our flow is broken.
// In this particular case, we might want to run the signup and
// login tests one after the other because we want to make sure
// that the signup + login flow works.
const apiResponse = {
  asset_id: 'f82474e02ed1230ad7c63c21f46b6349',
  public_id: 'hslk7drqodtixa0ui2e7',
  version: 1712675030,
  version_id: '7926a1abad8b3cc8c15003861a9a0934',
  signature: '625320550b4cc26e2155fcc21988cceb71dc0515',
  width: 328,
  height: 388,
  format: 'png',
  resource_type: 'image',
  created_at: '2024-04-09T15:03:50Z',
  tags: [],
  bytes: 85832,
  type: 'upload',
  etag: '5cf6f535fc605729310207d03d20e858',
  placeholder: false,
  url: 'http://res.cloudinary.com/diqcnybcx/image/upload/v1712675030/hslk7drqodtixa0ui2e7.png',
  secure_url:
    'https://res.cloudinary.com/diqcnybcx/image/upload/v1712675030/hslk7drqodtixa0ui2e7.png',
  folder: '',
  access_mode: 'public',
  original_filename: 'front-removebg-preview',
}

test.describe.serial('signup and login sequence', () => {
  test('visitor can signup', async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/signup')

    await page.route('https://api.cloudinary.com/v1_1/diqcnybcx/upload', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: apiResponse,
      })
    })

    const successMessage = page.getByTestId('successMessage')
    // const errorMessage = page.getByTestId('errorMessage')
    await expect(successMessage).toBeHidden() // sanity check

    // When (ACT)
    const form = page.getByRole('form', { name: 'Signup' })
    await form.locator('input#firstName').fill(firstName)
    await form.locator('input#lastName').fill(lastName)
    await form.locator('input[type="email"][required]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('input[type="number"]').fill(age.toString())
    const imagePath = path.resolve(__dirname, 'utils', 'tent.png')
    await page.setInputFiles('#profileImage', imagePath)

    await form.locator('button[type="submit"]').click()
    // Then (ASSERT)
    await expect(successMessage).toBeVisible({ timeout: 10000 })
    // await expect(errorMessage).toBeVisible()
  })

  // unskip this test to start working on the real login flow
  test('visitor can not access dashboard before login', async ({ page }) => {
    await page.goto('/dashboard')

    // user is redirected to login page
    await page.waitForURL('/login')
  })

  test('visitor can login', async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/login')
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' })
    await expect(dashboardLink).toBeHidden()

    // When (ACT)
    const form = page.getByRole('form', { name: 'Login' })
    await form.locator('input[type="email"]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    // Then (ASSERT)
    await expect(dashboardLink).toBeHidden()

    // Refresh the page to make sure that the user is still logged in.
    await page.reload()
    await expect(dashboardLink).toBeHidden()
  })
})
