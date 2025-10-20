import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await page.request.post('http://localhost:3000/api/reset');
  await page.goto('/');
  await page.getByTestId('username-input').fill('user1');
  await page.getByTestId('password-input').fill('password1');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/todos');
});

test('Verify Report Page', async ({ page }) => {
  // Add a completed todo
  await page.getByTestId('new-task-input').fill('Completed todo for report');
  await page.getByTestId('add-todo-button').click();
  const completedTodoItem = page.locator('[data-testid^="todo-item-"]').filter({ hasText: 'Completed todo for report' });
  await completedTodoItem.getByTestId(/start-button-.*/).click();
  await completedTodoItem.getByTestId(/done-button-.*/).click();

  // Add an in-progress todo
  await page.getByTestId('new-task-input').fill('In progress todo for report');
  await page.getByTestId('add-todo-button').click();
  const inProgressTodoItem = page.locator('[data-testid^="todo-item-"]').filter({ hasText: 'In progress todo for report' });
  await inProgressTodoItem.getByTestId(/start-button-.*/).click();

  // Navigate to the report page
  await page.getByTestId('report-button').click();
  await expect(page).toHaveURL('/report');

  // Check the report data
  await expect(page.getByTestId('completed-todos')).toContainText('1');
  await expect(page.getByTestId('in-progress-todos')).toContainText('1');
});
