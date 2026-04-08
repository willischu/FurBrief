import { test, expect } from '@playwright/test';

async function waitForHydration(page: any) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(200);
}

test('privacy page loads', async ({ page }) => {
  await page.goto('/privacy');
  await waitForHydration(page);
  await expect(page).toHaveTitle(/furbrief/i);
});

test('privacy page shows title in English by default', async ({ page }) => {
  await page.goto('/privacy');
  await waitForHydration(page);
  await expect(page.locator('h1')).toContainText('privacy policy');
});

test('privacy page language switcher changes title to Spanish', async ({ page }) => {
  await page.goto('/privacy');
  await waitForHydration(page);
  await page.locator('.globe-btn').click();
  await page.locator('.ldrop .lopt', { hasText: 'Español' }).click();
  await expect(page.locator('h1')).toContainText('política de privacidad');
});

test('privacy page language switcher changes title to Korean', async ({ page }) => {
  await page.goto('/privacy');
  await waitForHydration(page);
  await page.locator('.globe-btn').click();
  await page.locator('.ldrop .lopt', { hasText: '한국어' }).click();
  await expect(page.locator('h1')).toContainText('개인정보처리방침');
});

test('privacy page language switcher changes title to Chinese', async ({ page }) => {
  await page.goto('/privacy');
  await waitForHydration(page);
  await page.locator('.globe-btn').click();
  await page.locator('.ldrop .lopt', { hasText: '中文' }).click();
  await expect(page.locator('h1')).toContainText('隐私政策');
});

test('privacy page globe button reflects selected language', async ({ page }) => {
  await page.goto('/privacy');
  await waitForHydration(page);
  await page.locator('.globe-btn').click();
  await page.locator('.ldrop .lopt', { hasText: 'Español' }).click();
  await expect(page.locator('.globe-btn')).toContainText('ES');
});

test('privacy page nav brand links to /', async ({ page }) => {
  await page.goto('/privacy');
  await waitForHydration(page);
  await page.locator('nav .brand').click();
  await expect(page).toHaveURL('/');
});

test('privacy page shows contact email link', async ({ page }) => {
  await page.goto('/privacy');
  await waitForHydration(page);
  await expect(page.locator('a[href*="furbrief@proton.me"]').first()).toBeVisible();
});

test('language persists from landing to privacy page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(200);

  // Select Spanish on landing page
  await page.locator('.globe-btn').click();
  await page.locator('.ldrop .lopt', { hasText: 'Español' }).click();

  // Navigate to privacy page
  await page.goto('/privacy');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // Privacy page should reflect Spanish
  await expect(page.locator('h1')).toContainText('política de privacidad');
});

test('language persists from landing to about page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(200);

  // Select Korean on landing page
  await page.locator('.globe-btn').click();
  await page.locator('.ldrop .lopt', { hasText: '한국어' }).click();

  // Navigate to about page
  await page.goto('/about');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // Globe button should reflect Korean
  await expect(page.locator('.globe-btn')).toContainText('KO');
});
