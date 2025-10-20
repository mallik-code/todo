import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username-input').fill('user1');
  await page.getByTestId('password-input').fill('password1');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/todos');
});

test('Delete a Todo', async ({ page }) => {
  await page.getByTestId('new-task-input').fill('Clean the house');
  await page.getByTestId('add-todo-button').click();
  const todoItem = page.locator('[data-testid^="todo-item-"]').filter({ hasText: 'Clean the house' });
  const deleteButton = todoItem.getByTestId(/delete-button-.*/);
  await deleteButton.click();
  await expect(page.getByText('Clean the house')).not.toBeVisible();
});
