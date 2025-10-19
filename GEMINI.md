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
    *   `data-testid` attributes are used to select elements in the tests for better stability.
    *   The backend provides a `/api/reset` endpoint to reset the database state before each test run.
    *   Tests that modify the backend state are configured to run sequentially to avoid interference.
