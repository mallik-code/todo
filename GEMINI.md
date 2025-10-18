# GEMINI.md

This file provides a comprehensive overview of the project, its structure, and how to run and test it. It is intended to be used as instructional context for future interactions with the Gemini AI agent.

## Project Overview

This is a full-stack todo application with a React frontend and a Node.js/Express backend.

*   **Frontend:** A single-page application built with React. It allows users to log in, manage their todo list, and view a report of their todos.
*   **Backend:** A Node.js/Express server that provides a REST API for the frontend. It handles user authentication and todo management. The data is stored in-memory.
*   **Testing:** The project uses Playwright for end-to-end UI automation testing.

The project is structured as a monorepo with two main directories: `frontend` and `backend`.

## Building and Running

### Backend

To run the backend server, follow these steps:

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node server.js
    ```
The backend server will be running on `http://localhost:3000`.

### Frontend

To run the frontend application, follow these steps:

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
The frontend application will be running on `http://localhost:3001`.

## Testing

The project uses Playwright for end-to-end testing. The tests are located in the `frontend/tests` directory.

To run the tests, follow these steps. By default, they run in headless mode (no visible browser).

1.  Make sure both the backend and frontend servers are running.
2.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
3.  Run the tests:
    ```bash
    npx playwright test
    ```

To run the tests in headed mode (with a visible browser), use this command:
```bash
npx playwright test --headed
```

## Playwright MCP Server Setup

This section describes how to set up the Playwright MCP server to allow Gemini to interact with the browser.

1.  **Install the server dependencies:**
    The core Playwright tool is used to manage the browsers.

    ```bash
    # Install the Playwright browsers (Chromium, Firefox, WebKit)
    npx playwright install
    ```

2.  **Configure Gemini CLI:**
    You need to tell the Gemini CLI where to find and how to run the Playwright MCP server. This is done by editing the Gemini CLI's user-specific configuration file (`settings.json`).

    * **Locate the `settings.json` file:**
        * **macOS / Linux:** `~/.gemini/settings.json`
        * **Windows:** `%USERPROFILE%\.gemini\settings.json`

    * **Update `settings.json`:**
        Add or modify the `mcpServers` section to include the Playwright MCP server configuration. This uses the widely supported **`@playwright/mcp@latest`** package and runs in **headed (visible) mode** for easier debugging.

        ```json
        {
            "ide": {
                "hasSeenNudge": true,
                "enabled": true
            },
            "security": {
                "auth": {
                "selectedType": "oauth-personal"
                }
            },
            "mcpServers": {
                "playwright": {
                "command": "npx",
                "args": [
                    "@playwright/mcp@latest"
                    // To run headless (hidden browser), add the argument: "--headless"
                ]
                }
            }
        }
        ```

3.  **Start Gemini:**
    Open a new terminal and type `gemini` to start the Gemini CLI. It should now be able to locate and run the Playwright MCP server. You can verify this by checking for "1 MCP Server" above the chatbox in the Gemini CLI and by running the `/mcp` command.



## Development Conventions

*   **Styling:** The project uses Bootstrap for styling. The Bootstrap CSS is imported in `frontend/src/index.js`.
*   **API Communication:** The frontend communicates with the backend via a REST API. The API service is defined in `frontend/src/services/api.js`.
*   **Testing:**
    *   Playwright is used for end-to-end testing.
    *   Tests are located in the `frontend/tests` directory.
    *   `data-testid` attributes are used to select elements in the tests for better stability.
    *   The backend provides a `/api/reset` endpoint to reset the database state before each test run.
    *   Tests that modify the backend state are configured to run sequentially to avoid interference.
