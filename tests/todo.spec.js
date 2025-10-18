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

test('should allow a user to add a new todo', async ({ page }) => {
  // Add a new todo
  await page.getByTestId('new-task-input').fill('New test todo');
  await page.waitForTimeout(1000);
  await page.getByTestId('add-todo-button').click();
  await page.waitForTimeout(1000);

  // Check that the new todo is in the list
  await expect(page.getByText('New test todo')).toBeVisible();
});

test('should allow a user to mark a todo as in progress', async ({ page }) => {
    // Add a new todo to work with
    await page.getByTestId('new-task-input').fill('Todo to mark as in progress');
    await page.waitForTimeout(1000);
    await page.getByTestId('add-todo-button').click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Todo to mark as in progress')).toBeVisible();

    // Find the todo item and the start button
    const todoItem = page.locator('[data-testid^="todo-item-"]').filter({ hasText: 'Todo to mark as in progress' });
    const startButton = todoItem.getByTestId(/start-button-.*/);
    const todoStatus = todoItem.getByTestId(/todo-status-.*/);


    // Click the start button
    await startButton.click();
    await page.waitForTimeout(1000);

    // Check that the status is updated
    await expect(todoStatus).toHaveText('In Progress');
});

test('should allow a user to mark a todo as completed', async ({ page }) => {
    // Add a new todo to work with
    await page.getByTestId('new-task-input').fill('Todo to mark as completed');
    await page.waitForTimeout(1000);
    await page.getByTestId('add-todo-button').click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Todo to mark as completed')).toBeVisible();

    // Find the todo item and the done button
    const todoItem = page.locator('[data-testid^="todo-item-"]').filter({ hasText: 'Todo to mark as completed' });
    const doneButton = todoItem.getByTestId(/done-button-.*/);
    const todoStatus = todoItem.getByTestId(/todo-status-.*/);

    // Click the done button
    await doneButton.click();
    await page.waitForTimeout(1000);

    // Check that the status is updated
    await expect(todoStatus).toHaveText('Completed');
});

test('should allow a user to delete a todo', async ({ page }) => {
    // Add a new todo to work with
    await page.getByTestId('new-task-input').fill('Todo to delete');
    await page.waitForTimeout(1000);
    await page.getByTestId('add-todo-button').click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Todo to delete')).toBeVisible();

    // Find the todo item and the delete button
    const todoItem = page.locator('[data-testid^="todo-item-"]').filter({ hasText: 'Todo to delete' });
    const deleteButton = todoItem.getByTestId(/delete-button-.*/);

    // Click the delete button
    await deleteButton.click();
    await page.waitForTimeout(1000);

    // Check that the todo is removed from the list
    await expect(page.getByText('Todo to delete')).not.toBeVisible();
});

test('should display the correct report', async ({ page }) => {
  // Add a completed todo
  await page.getByTestId('new-task-input').fill('Completed todo for report');
  await page.waitForTimeout(1000);
  await page.getByTestId('add-todo-button').click();
  await page.waitForTimeout(1000);
  const completedTodoItem = page.locator('[data-testid^="todo-item-"]').filter({ hasText: 'Completed todo for report' });
  await completedTodoItem.getByTestId(/done-button-.*/).click();
  await page.waitForTimeout(1000);


  // Add an in-progress todo
  await page.getByTestId('new-task-input').fill('In progress todo for report');
  await page.waitForTimeout(1000);
  await page.getByTestId('add-todo-button').click();
  await page.waitForTimeout(1000);
  const inProgressTodoItem = page.locator('[data-testid^="todo-item-"]').filter({ hasText: 'In progress todo for report' });
  await inProgressTodoItem.getByTestId(/start-button-.*/).click();
  await page.waitForTimeout(1000);


  // Navigate to the report page
  await page.getByTestId('report-button').click();
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL('/report');

  // Check the report data
  await expect(page.getByTestId('completed-todos')).toContainText('2');
  await expect(page.getByTestId('in-progress-todos')).toContainText('2');
});