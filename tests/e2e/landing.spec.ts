import { test, expect } from '@playwright/test';
import path from 'path';

test.beforeEach(async ({ page }) => {
  await page.route('/api/upload', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ blob_url: 'https://example.com/test-upload.pdf' }),
    });
  });
});

// Wait for React hydration via a reliable client-rendered marker
async function waitForHydration(page: any) {
  await page.waitForLoadState('networkidle');
  // Give React a tick to finish hydration
  await page.waitForTimeout(200);
}

test('landing page loads and shows upload zone', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  await expect(page.locator('.uzone')).toBeVisible();
  await expect(page.locator('.utit')).toBeVisible();
});

test('upload zone shows correct hint text', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  await expect(page.locator('.uhint')).toContainText('PDF');
});

test('CTA button navigates to /upload', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  await page.locator('.hero-outer .cbtn').click();
  await expect(page).toHaveURL('/upload');
});

test('nav CTA navigates to /upload', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  await page.locator('a.nav-cta').click();
  await expect(page).toHaveURL('/upload');
});

test('file upload shows success card and redirects to /upload', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  const filePath = path.join(__dirname, '../fixtures/sample.pdf');
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await expect(page).toHaveURL('/upload', { timeout: 10_000 });
});

test('navigating back after upload shows stored file card', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    sessionStorage.setItem('furbrief_blob_url', 'https://example.com/test.pdf');
    sessionStorage.setItem('furbrief_file_name', 'luna-discharge.pdf');
    sessionStorage.setItem('furbrief_file_size', '1.20 MB');
  });
  await page.reload();
  await waitForHydration(page);
  await expect(page.locator('.uzone')).not.toBeVisible();
  await expect(page.getByText('luna-discharge.pdf')).toBeVisible();
  await expect(page.getByText('ready to translate')).toBeVisible();
});

test('X button on stored file card clears it and shows drop zone', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    sessionStorage.setItem('furbrief_blob_url', 'https://example.com/test.pdf');
    sessionStorage.setItem('furbrief_file_name', 'luna-discharge.pdf');
    sessionStorage.setItem('furbrief_file_size', '1.20 MB');
  });
  await page.reload();
  await waitForHydration(page);
  await page.locator('[title="Upload a different file"]').click();
  await expect(page.locator('.uzone')).toBeVisible();
  await expect(page.getByText('luna-discharge.pdf')).not.toBeVisible();
});

test('language switcher in nav changes page language', async ({ page }) => {
  await page.goto('/');
  await waitForHydration(page);
  await page.locator('.globe-btn').click();
  await page.locator('.ldrop .lopt', { hasText: 'Español' }).click();
  await expect(page.locator('.utit')).toContainText('arrastra');
});
