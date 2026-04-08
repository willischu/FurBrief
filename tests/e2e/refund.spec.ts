import { test, expect } from '@playwright/test';

const ORDER_ID = 'test-order-123';
const PROCESSING_URL = `/processing/${ORDER_ID}`;
const REFUND_EMAIL = 'furbrief@proton.me';

function mockFailed(page: any) {
  return page.route(`/api/brief/${ORDER_ID}`, (route: any) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'failed' }),
    })
  );
}

function mockProcessing(page: any) {
  return page.route(`/api/brief/${ORDER_ID}`, (route: any) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'processing' }),
    })
  );
}

// ── Failure state ────────────────────────────────────────────────────────────

test('shows failure screen when API returns failed', async ({ page }) => {
  await mockFailed(page);
  await page.goto(PROCESSING_URL);
  await expect(page.getByText('something went wrong')).toBeVisible({ timeout: 10_000 });
});

test('failure screen shows refund email link', async ({ page }) => {
  await mockFailed(page);
  await page.goto(PROCESSING_URL);
  await expect(page.getByText('something went wrong')).toBeVisible({ timeout: 10_000 });
  const link = page.locator(`a[href*="${REFUND_EMAIL}"]`);
  await expect(link).toBeVisible();
});

test('refund mailto link contains correct email address', async ({ page }) => {
  await mockFailed(page);
  await page.goto(PROCESSING_URL);
  await expect(page.getByText('something went wrong')).toBeVisible({ timeout: 10_000 });
  const link = page.locator(`a[href*="${REFUND_EMAIL}"]`);
  const href = await link.getAttribute('href');
  expect(href).toContain(`mailto:${REFUND_EMAIL}`);
});

test('refund mailto link pre-fills subject as Refund request', async ({ page }) => {
  await mockFailed(page);
  await page.goto(PROCESSING_URL);
  await expect(page.getByText('something went wrong')).toBeVisible({ timeout: 10_000 });
  const link = page.locator(`a[href*="${REFUND_EMAIL}"]`);
  const href = await link.getAttribute('href');
  expect(href).toContain('subject=Refund+request');
});

test('refund mailto link pre-fills body with order ID', async ({ page }) => {
  await mockFailed(page);
  await page.goto(PROCESSING_URL);
  await expect(page.getByText('something went wrong')).toBeVisible({ timeout: 10_000 });
  const link = page.locator(`a[href*="${REFUND_EMAIL}"]`);
  const href = await link.getAttribute('href');
  expect(href).toContain(ORDER_ID);
});

// ── Language variants ────────────────────────────────────────────────────────

test('failure screen shows Spanish copy when language is es', async ({ page }) => {
  await mockFailed(page);
  // Set language in localStorage before navigating
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('furbrief_lang', 'es'));
  await page.goto(PROCESSING_URL);
  await expect(page.getByText('algo salió mal')).toBeVisible({ timeout: 10_000 });
});

test('failure screen shows Korean copy when language is ko', async ({ page }) => {
  await mockFailed(page);
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('furbrief_lang', 'ko'));
  await page.goto(PROCESSING_URL);
  await expect(page.getByText('문제가 발생했습니다')).toBeVisible({ timeout: 10_000 });
});

test('failure screen shows Chinese copy when language is zh', async ({ page }) => {
  await mockFailed(page);
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('furbrief_lang', 'zh'));
  await page.goto(PROCESSING_URL);
  await expect(page.getByText('出现了问题')).toBeVisible({ timeout: 10_000 });
});

// ── Processing (non-failure) state ───────────────────────────────────────────

test('does not show failure screen while processing', async ({ page }) => {
  await mockProcessing(page);
  await page.goto(PROCESSING_URL);
  await page.waitForTimeout(500);
  await expect(page.getByText('something went wrong')).not.toBeVisible();
});

test('shows progress bar while processing', async ({ page }) => {
  await mockProcessing(page);
  await page.goto(PROCESSING_URL);
  await page.waitForTimeout(500);
  await expect(page.locator('.prog-fill-bar')).toBeVisible();
});
