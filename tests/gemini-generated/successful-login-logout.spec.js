import { test, expect } from '@playwright/test';

test('Successful Login and Logout', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username-input').fill('user1');
  await page.getByTestId('password-input').fill('password1');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/todos');
  await page.getByTestId('logout-button').click();
  await expect(page).toHaveURL('/');
});
