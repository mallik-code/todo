import { test, expect } from '@playwright/test';

test('Failed Login', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username-input').fill('user1');
  await page.getByTestId('password-input').fill('wrongpassword');
  await page.getByRole('button', { name: 'Login' }).click();
  const errorMessage = await page.locator('.alert-danger');
  await expect(errorMessage).toBeVisible();
});
