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

  await page.route('/api/create-checkout', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ url: 'https://checkout.stripe.com/test' }),
    });
  });
});

async function waitForHydration(page: any) {
  await page.waitForSelector('[data-hydrated="true"]', { timeout: 10_000 });
}

test('upload page loads with correct default text', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  await expect(page.locator('.uzone')).toBeVisible();
  await expect(page.getByText('drop your discharge papers here')).toBeVisible();
});

test('upload page shows 3 step cards', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  const stepCards = page.locator('.step-card');
  await expect(stepCards).toHaveCount(3);
});

test('language selector changes page UI to Spanish', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  await page.locator('.bpill', { hasText: 'Español' }).first().click();
  await expect(page.getByText('arrastra tus papeles aquí')).toBeVisible();
  await expect(page.getByText('sube tus papeles', { exact: true })).toBeVisible();
});

test('language selector changes page UI to Korean', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  await page.locator('.bpill', { hasText: '한국어' }).first().click();
  await expect(page.getByText('퇴원 서류를 여기에 끌어다 놓으세요')).toBeVisible();
});

test('language selector changes page UI to Chinese', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  await page.locator('.bpill', { hasText: '中文' }).first().click();
  await expect(page.getByText('将出院文件拖放到这里')).toBeVisible();
});

test('selected language pill is highlighted', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  // English is selected by default
  await expect(page.locator('.fu .bpill.on', { hasText: 'English' })).toBeVisible();

  // Switch to Spanish — that pill becomes active
  await page.locator('.fu .bpill', { hasText: 'Español' }).click();
  await expect(page.locator('.fu .bpill.on', { hasText: 'Español' })).toBeVisible();
  await expect(page.locator('.fu .bpill.on', { hasText: 'English' })).toHaveCount(0);
});

test('file upload shows success card', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  const filePath = path.join(__dirname, '../fixtures/sample.pdf');
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await expect(page.getByText('ready to translate')).toBeVisible({ timeout: 5_000 });
  await expect(page.locator('.uzone')).not.toBeVisible();
});

test('clear file button restores drop zone', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  const filePath = path.join(__dirname, '../fixtures/sample.pdf');
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await expect(page.getByText('ready to translate')).toBeVisible({ timeout: 5_000 });
  await page.locator('[title="Remove file"]').click();
  await expect(page.locator('.uzone')).toBeVisible();
});

test('pet name field accepts input', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  const input = page.getByPlaceholder('e.g. luna');
  await input.fill('Mochi');
  await expect(input).toHaveValue('Mochi');
});

test('species pills are selectable', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  await page.getByRole('button', { name: 'cat' }).click();
  await expect(page.locator('.bpill.on', { hasText: 'cat' })).toBeVisible();
});

test('order summary updates with pet name', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  await page.getByPlaceholder('e.g. luna').fill('Mochi');
  await expect(page.getByText(/furbrief for Mochi/)).toBeVisible();
});

test('pre-populates file from sessionStorage', async ({ page }) => {
  await page.goto('/upload');
  await page.evaluate(() => {
    sessionStorage.setItem('furbrief_blob_url', 'https://example.com/test.pdf');
    sessionStorage.setItem('furbrief_file_name', 'luna-discharge.pdf');
    sessionStorage.setItem('furbrief_file_size', '2.10 MB');
  });
  await page.reload();
  await waitForHydration(page);
  await expect(page.getByText('luna-discharge.pdf')).toBeVisible();
  await expect(page.getByText('ready to translate')).toBeVisible();
  await expect(page.locator('.uzone')).not.toBeVisible();
});

test('paste toggle shows and hides textarea', async ({ page }) => {
  await page.goto('/upload');
  await waitForHydration(page);
  await page.getByText('or paste the text instead').click();
  await expect(page.getByPlaceholder('Paste your discharge notes here')).toBeVisible();
  await page.getByText('hide paste field').click();
  await expect(page.getByPlaceholder('Paste your discharge notes here')).not.toBeVisible();
});
