import { test, expect } from '@playwright/test';
import path from 'path';

test.beforeEach(async ({ page }) => {
  // Mock upload API so no real Supabase calls happen
  await page.route('/api/upload', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ blob_url: 'https://example.com/test-upload.pdf' }),
    });
  });
});

test('landing page loads and shows upload zone', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.uzone')).toBeVisible();
  await expect(page.locator('.utit')).toBeVisible();
});

test('upload zone shows correct hint text', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.uhint')).toContainText('PDF');
});

test('CTA button navigates to /upload', async ({ page }) => {
  await page.goto('/');
  await page.locator('.cbtn').first().click();
  await expect(page).toHaveURL('/upload');
});

test('nav CTA navigates to /upload', async ({ page }) => {
  await page.goto('/');
  await page.locator('.nav-cta').click();
  await expect(page).toHaveURL('/upload');
});

test('file upload shows success card and redirects to /upload', async ({ page }) => {
  await page.goto('/');

  const filePath = path.join(__dirname, '../fixtures/sample.pdf');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);

  // Should redirect to /upload after upload completes
  await expect(page).toHaveURL('/upload', { timeout: 10_000 });
});

test('navigating back after upload shows stored file card', async ({ page }) => {
  await page.goto('/');

  // Seed sessionStorage to simulate a previous upload
  await page.evaluate(() => {
    sessionStorage.setItem('furbrief_blob_url', 'https://example.com/test.pdf');
    sessionStorage.setItem('furbrief_file_name', 'luna-discharge.pdf');
    sessionStorage.setItem('furbrief_file_size', '1.20 MB');
  });
  await page.reload();

  // Should show the success card instead of the drop zone
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

  await page.locator('[title="Upload a different file"]').click();
  await expect(page.locator('.uzone')).toBeVisible();
  await expect(page.getByText('luna-discharge.pdf')).not.toBeVisible();
});

test('language switcher in nav changes page language', async ({ page }) => {
  await page.goto('/');
  await page.locator('.globe-btn').click();
  await page.getByText('Español').click();
  await expect(page.locator('.utit')).toContainText('arrastra');
});
