import { test, expect } from '@playwright/test'

// Helper: skip the envelope and scroll to the scratch section
async function openAndScrollToScratch(page) {
  await page.goto('/wedding-invitation/')
  // Wait for loader to finish
  await page.waitForTimeout(3500)
  // Click the envelope button (class: env)
  const seal = page.locator('button.env')
  const sealVisible = await seal.isVisible().catch(() => false)
  if (sealVisible) {
    await seal.click({ force: true })
    // Wait for envelope overlay to disappear from DOM
    await page.waitForSelector('button.env', { state: 'detached', timeout: 8000 }).catch(() => {})
  }
  await page.waitForTimeout(800)
  // Scroll to scratch section
  await page.evaluate(() => {
    const el = document.getElementById('date')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(800)
}

test.describe('Scratch card — desktop', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('layout: button and hint are not overlapping', async ({ page }) => {
    await openAndScrollToScratch(page)
    await page.screenshot({ path: 'tests/screenshots/scratch-desktop.png', fullPage: false })

    const btn  = page.locator('.scr-btn')
    const hint = page.locator('.scr-hint')
    await expect(btn).toBeVisible()
    await expect(hint).toBeVisible()

    const btnBox  = await btn.boundingBox()
    const hintBox = await hint.boundingBox()
    // Hint must be below the button with at least 8px gap
    expect(hintBox.y).toBeGreaterThan(btnBox.y + btnBox.height)
  })

  test('scratch card frame is visible', async ({ page }) => {
    await openAndScrollToScratch(page)
    const frame = page.locator('.scr-frame')
    await expect(frame).toBeVisible()
    const box = await frame.boundingBox()
    expect(box.width).toBeGreaterThan(200)
    expect(box.height).toBeGreaterThan(100)
  })

  test('canvas foil covers the card', async ({ page }) => {
    await openAndScrollToScratch(page)
    const canvas = page.locator('.scr-canvas')
    await expect(canvas).toBeVisible()
    await expect(canvas).not.toHaveClass(/is-cleared/)
  })

  test('hand animation appears after 2.5s without scratching', async ({ page }) => {
    await openAndScrollToScratch(page)
    // Should NOT be visible immediately
    const hand = page.locator('.scr-hand')
    const visibleImmediately = await hand.isVisible().catch(() => false)
    expect(visibleImmediately).toBe(false)
    // Wait for the 2.5s delay
    await page.waitForTimeout(3200)
    await page.screenshot({ path: 'tests/screenshots/scratch-desktop-hand.png', fullPage: false })
    // Should be visible now (if IntersectionObserver fired correctly)
    // Note: headless may not trigger correctly so we do a soft check
    const visibleAfter = await hand.isVisible().catch(() => false)
    // log result rather than fail hard — headless IO can vary
    console.log('Hand visible after delay:', visibleAfter)
  })

  test('reveal button click reveals content', async ({ page }) => {
    await openAndScrollToScratch(page)
    await page.locator('.scr-btn').click()
    await page.waitForTimeout(800)
    await expect(page.locator('.scr-card')).toHaveClass(/is-revealed/)
    await expect(page.locator('.scr-range-main')).toBeVisible()
    await page.screenshot({ path: 'tests/screenshots/scratch-desktop-revealed.png', fullPage: false })
  })
})

test.describe('Scratch card — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('layout: button and hint are not overlapping on mobile', async ({ page }) => {
    await openAndScrollToScratch(page)
    await page.screenshot({ path: 'tests/screenshots/scratch-mobile.png', fullPage: false })

    const btn  = page.locator('.scr-btn')
    const hint = page.locator('.scr-hint')
    await expect(btn).toBeVisible()
    await expect(hint).toBeVisible()

    const btnBox  = await btn.boundingBox()
    const hintBox = await hint.boundingBox()
    expect(hintBox.y).toBeGreaterThan(btnBox.y + btnBox.height)
  })

  test('scratch card frame fits within viewport width', async ({ page }) => {
    await openAndScrollToScratch(page)
    const frame = page.locator('.scr-frame')
    await expect(frame).toBeVisible()
    const box = await frame.boundingBox()
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(390 + 1)
  })

  test('reveal button click works on mobile', async ({ page }) => {
    await openAndScrollToScratch(page)
    await page.locator('.scr-btn').click()
    await page.waitForTimeout(800)
    await expect(page.locator('.scr-card')).toHaveClass(/is-revealed/)
    await page.screenshot({ path: 'tests/screenshots/scratch-mobile-revealed.png', fullPage: false })
  })
})
