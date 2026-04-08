import { test, expect } from '@playwright/test';

async function waitForHydration(page: any) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(200);
}

test('about page loads', async ({ page }) => {
  await page.goto('/about');
  await waitForHydration(page);
  await expect(page).toHaveTitle(/furbrief/i);
});

test('about page shows problem section', async ({ page }) => {
  await page.goto('/about');
  await waitForHydration(page);
  await expect(page.locator('.problem')).toBeVisible();
});

test('about page shows wyg section', async ({ page }) => {
  await page.goto('/about');
  await waitForHydration(page);
  await expect(page.locator('.wyg')).toBeVisible();
});

test('about page shows FAQ section', async ({ page }) => {
  await page.goto('/about');
  await waitForHydration(page);
  await expect(page.locator('.faq-sec')).toBeVisible();
});

test('about page nav brand links to /', async ({ page }) => {
  await page.goto('/about');
  await waitForHydration(page);
  await page.locator('nav .brand').click();
  await expect(page).toHaveURL('/');
});

test('about page nav CTA links to /upload', async ({ page }) => {
  await page.goto('/about');
  await waitForHydration(page);
  await page.locator('a.nav-cta').click();
  await expect(page).toHaveURL('/upload');
});

test('about page language switcher changes content', async ({ page }) => {
  await page.goto('/about');
  await waitForHydration(page);
  await page.locator('.globe-btn').click();
  await page.locator('.ldrop .lopt', { hasText: 'Español' }).click();
  await expect(page.locator('.problem')).toContainText('el problema');
});

test('about page language switcher changes to Korean', async ({ page }) => {
  await page.goto('/about');
  await waitForHydration(page);
  await page.locator('.globe-btn').click();
  await page.locator('.ldrop .lopt', { hasText: '한국어' }).click();
  await expect(page.locator('.globe-btn')).toContainText('KO');
});

test('landing page has about link in nav', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  const aboutLink = page.locator('nav a[href="/about"]');
  await expect(aboutLink).toBeVisible();
});

test('landing page about nav link navigates to /about', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  await page.locator('nav a[href="/about"]').click();
  await expect(page).toHaveURL('/about');
});

test('landing page does not show wyg section', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  await expect(page.locator('.wyg')).not.toBeVisible();
});

test('landing page does not show problem section', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  await expect(page.locator('.problem')).not.toBeVisible();
});
