import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username-input').fill('user1');
  await page.getByTestId('password-input').fill('password1');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/todos');
});

test('Add a New Todo', async ({ page }) => {
  await page.getByTestId('new-task-input').fill('Buy milk');
  await page.getByTestId('add-todo-button').click();
  await expect(page.getByText('Buy milk')).toBeVisible();
});
