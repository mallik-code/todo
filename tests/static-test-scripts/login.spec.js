import { test, expect } from '@playwright/test';

test('should allow a user to log in', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/');
  await page.waitForTimeout(1000);

  // Fill in the username and password using data-testid
  await page.getByTestId('username-input').fill('user1');
  await page.waitForTimeout(1000);
  await page.getByTestId('password-input').fill('password1');
  await page.waitForTimeout(1000);

  // Click the login button
  await page.getByRole('button', { name: 'Login' }).click();

  // Check that the user is redirected to the todos page
  await expect(page).toHaveURL('/todos');
});