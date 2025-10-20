
import { test, expect } from '@playwright/test';

test.describe('Combined Test', () => {
  test('should log in, add a todo, start it, and then log out', async ({ page }) => {
    // Step 1: Open the URL and take a screenshot
    await page.goto('http://localhost:3001');
    await page.screenshot({ path: 'screenshots/01-opened-url.png' });

    // Step 2: Log in
    await page.getByTestId('username-input').fill('user1');
    await page.getByTestId('password-input').fill('password1');
    await page.screenshot({ path: 'screenshots/02-filled-credentials.png' });
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/todos');
    await page.screenshot({ path: 'screenshots/03-logged-in.png' });

    // Step 3: Add a new todo
    await page.getByTestId('new-task-input').fill('Buy Mangoes');
    await page.screenshot({ path: 'screenshots/04-filled-new-todo.png' });
    await page.getByTestId('add-todo-button').click();
    await expect(page.getByText('Buy Mangoes')).toBeVisible();
    await page.screenshot({ path: 'screenshots/05-added-todo.png' });

    // Step 4: Mark the todo as in progress
    const todoItem = page.locator('[data-testid^="todo-item-"]').filter({ hasText: 'Buy Mangoes' });
    const startButton = todoItem.getByTestId(/start-button-.*/);
    await startButton.click();
    const todoStatus = todoItem.getByTestId(/todo-status-.*/);
    await expect(todoStatus).toHaveText('In Progress');
    await page.screenshot({ path: 'screenshots/06-todo-in-progress.png' });

    // Step 5: Log out
    await page.getByTestId('logout-button').click();
    await expect(page).toHaveURL('/');
    await page.screenshot({ path: 'screenshots/07-logged-out.png' });
  });
});
