import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  // Reset the database before each test
  await page.request.post('http://localhost:3000/api/reset');

  // Log in before each test
  await page.goto('/');
  await page.getByTestId('username-input').fill('user1');
  await page.getByTestId('password-input').fill('password1');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/todos');
});

test('should allow a user to add a new todo and take a screenshot', async ({ page }) => {
  // Add a new todo
  await page.getByTestId('new-task-input').fill('Buy Apples');
  await page.getByTestId('add-todo-button').click();

  // Check that the new todo is in the list
  await expect(page.getByText('Buy Apples')).toBeVisible();

  // Take a screenshot
  await page.screenshot({ path: 'todo-added-2.png' });
});
