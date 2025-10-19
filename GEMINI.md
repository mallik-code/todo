# GEMINI.md

This file provides a comprehensive overview of the project, its structure, and how to run and test it. It is intended to be used as instructional context for future interactions with the Gemini AI agent.

## Project Overview

This is a full-stack todo application with a React frontend and a Node.js/Express backend.

*   **Frontend:** A single-page application built with React. It allows users to log in, manage their todo list, and view a report of their todos.
*   **Backend:** A Node.js/Express server that provides a REST API for the frontend. It handles user authentication and todo management. The data is stored in a PostgreSQL database. It also features an activity log to track user actions.
*   **Testing:** The project uses Playwright for end-to-end UI automation testing.

The project is structured as a monorepo. See the "Directory Structure" section for more details.

## Building and Running

### Backend

To run the backend server, follow these steps:

1.  **Start the database:** The backend requires a PostgreSQL database. A Docker Compose configuration is provided in the `iac` directory. To start the database, run the following command from the project root:
    ```bash
    docker-compose -f iac/docker-compose.yaml up -d
    ```
2.  **Set up environment variables:** Create a `.env` file in the project root with the following content:
    ```
    POSTGRES_USER=user
    POSTGRES_PASSWORD=password
    POSTGRES_DB=testdb
    ```
3.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
4.  Install the dependencies:
    ```bash
    npm install
    ```
5.  Start the server:
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

## Testing with Gemini and Playwright

You can use Gemini to write and execute Playwright tests for you. To do this, you need to structure your prompt in a specific way.

### Prompt Structure

Your prompt should start by referencing the Playwright configuration file, followed by a clear and detailed description of the test case.

```
@frontend\playwright.config.js "Your detailed test instructions here"
```

### Instructions for Writing Test Prompts

When writing the test instructions, be as specific as possible. Describe the actions to be performed in a sequential manner. Use user-facing attributes like labels, roles, or text to identify elements, as this makes the tests more robust. If specific `data-testid` attributes are available, you can instruct Gemini to use them.

### Example Prompt

Here is an example of a detailed prompt to test the login functionality:

```
@frontend\playwright.config.js "Open the browser (use headed mode), navigate to the frontend URL (http://localhost:3001). Wait for the 'Login' page to be fully interactive. Then, perform the following actions sequentially using user-facing attributes (like labels or roles) for locators: 1. Fill the field with data-testid 'username-input' with 'user1'. 2. Fill the field with data-testid 'password-input' with 'password1'. 3. Click the 'Login' button. End by taking a screenshot named 'post-login-attempt.png'."
```

This prompt will instruct Gemini to:
1.  Create a new Playwright test file.
2.  The test will run in a visible browser window (`headed mode`).
3.  Navigate to the application.
4.  Fill in the login form.
5.  Click the login button.
6.  Take a screenshot to verify the result.

By following this structure, you can leverage Gemini to automate the creation and execution of your Playwright tests.



## Directory Structure

The project is structured as a monorepo with the following top-level directories:

*   `frontend/`: Contains the React frontend application.
*   `backend/`: Contains the Node.js/Express backend server.
*   `iac/`: Contains Infrastructure as Code (IaC) files, such as Docker Compose configurations.

*   `.env`: A file at the root of the project to store environment variables for the database connection.

This structure is intended to promote a clean separation of concerns and a scalable architecture. Future development should adhere to these principles, organizing code by feature or domain and maintaining a clear distinction between different parts of the application.

## Development Conventions

*   **Styling:** The project uses Bootstrap for styling. The Bootstrap CSS is imported in `frontend/src/index.js`.
*   **API Communication:** The frontend communicates with the backend via a REST API. The API service is defined in `frontend/src/services/api.js`.
*   **Activity Log:** User actions are logged to the `activity_log` table in the database. The frontend provides an "Activity" page to view these logs.
*   **Testing:**
    *   Playwright is used for end-to-end testing.
    *   Tests are located in the `frontend/tests` directory.
    *   `data-testid` attributes are used to select elements in the tests for better stability. For input elements, the convention is to use the format `<name>-input`, for example `username-input`.
    *   The backend provides a `/api/reset` endpoint to reset the database state before each test run.
    *   Tests that modify the backend state are configured to run sequentially to avoid interference.
