import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username-input').fill('user1');
  await page.getByTestId('password-input').fill('password1');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/todos');
});

test('Mark a Todo as In Progress', async ({ page }) => {
  await page.getByTestId('new-task-input').fill('Walk the dog');
  await page.getByTestId('add-todo-button').click();
  const todoItem = page.locator('[data-testid^="todo-item-"]').filter({ hasText: 'Walk the dog' });
  const startButton = todoItem.getByTestId(/start-button-.*/);
  await startButton.click();
  const todoStatus = todoItem.getByTestId(/todo-status-.*/);
  await expect(todoStatus).toHaveText('In Progress');
});
