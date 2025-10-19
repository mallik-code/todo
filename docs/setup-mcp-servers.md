# MCP Server Setup for Gemini CLI

This document provides instructions on how to set up and configure the Playwright and Postgres MCP servers to work with the Gemini CLI.

## Playwright MCP Server Setup

The Playwright MCP server allows Gemini to interact with a web browser for automated testing.

### 1. Install Playwright

Install the necessary Playwright browsers (Chromium, Firefox, WebKit) by running the following command in your terminal:

```bash
npx playwright install
```

### 2. Configure Gemini CLI for Playwright

You need to configure the Gemini CLI to recognize the Playwright MCP server. This is done by editing the `settings.json` file.

*   **Locate the `settings.json` file:**
    *   **macOS / Linux:** `~/.gemini/settings.json`
    *   **Windows:** `%USERPROFILE%\.gemini\settings.json`

*   **Update `settings.json`:**
    Add or modify the `mcpServers` section in your `settings.json` file to include the following configuration for Playwright. This configuration runs the browser in headed (visible) mode.

    ```json
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headed"
      ]
    }
    ```

## Postgres MCP Server Setup

The Postgres MCP server allows Gemini to interact with your PostgreSQL database.

### 1. Run the Postgres MCP Server

The `postgres-mcp` server is configured to run as a Docker container using the `docker-compose.yaml` file located in the `iac` directory.

To start the server, run the following command from the root of the project:

```bash
docker-compose -f iac/docker-compose.yaml up -d
```

This will start both the `db` (PostgreSQL) and the `postgres-mcp` services. The `postgres-mcp` server will be available at `http://localhost:8000`.

### 2. Configure Gemini CLI for Postgres MCP

*   **Locate the `settings.json` file:** (See paths in the Playwright section)

*   **Update `settings.json`:**
    Add the following configuration for `postgres-mcp` to the `mcpServers` section in your `settings.json` file.

    ```json
    "postgres-mcp": {
      "url": "http://localhost:8000/sse",
      "transport": "sse",
      "trustLevel": "full"
    }
    ```

## Final `settings.json` Configuration

After configuring both servers, your `mcpServers` section in `settings.json` should look like this:

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
        "@playwright/mcp@latest",
        "--headed"
      ]
    },
    "postgres-mcp": {
      "url": "http://localhost:8000/sse",
      "transport": "sse",
      "trustLevel": "full"
    }
  }
}
```

With this configuration, you can now use Gemini to interact with both your web browser via Playwright and your PostgreSQL database via the Postgres MCP server.
