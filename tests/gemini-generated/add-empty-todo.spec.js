import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Reset the database before each test
  await page.request.post('http://localhost:3000/api/reset');
  await page.goto('/');
  await page.getByTestId('username-input').fill('user1');
  await page.getByTestId('password-input').fill('password1');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/todos');
});

test('Attempt to Add an Empty Todo', async ({ page }) => {
  // After login, the page should have no todos
  await expect(page.locator('[data-testid^="todo-item-"]')).toHaveCount(0);

  // Get the initial count (which is 0)
  const initialTodoCount = await page.locator('[data-testid^="todo-item-"]').count();

  // Attempt to add an empty todo
  await page.getByTestId('add-todo-button').click();

  // Assert that the count has not changed
  const finalTodoCount = await page.locator('[data-testid^="todo-item-"]').count();
  expect(finalTodoCount).toBe(initialTodoCount);
});