todo app for learning mcp

## Testing

This project uses Playwright for end-to-end testing.

To run the tests, first make sure both the backend and frontend servers are running.

Navigate to the `frontend` directory:

```bash
cd frontend
```

By default, the tests run in headless mode (without a visible browser window):

```bash
npx playwright test
```

To run the tests with a visible browser window, use the `--headed` flag:

```bash
npx playwright test --headed
```