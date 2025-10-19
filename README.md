# Todo App

This is a full-stack todo application built to learn and demonstrate the capabilities of a modern web development stack.

## Overview

The application is a simple todo list manager where users can register, log in, and manage their tasks. It features a React frontend and a Node.js/Express backend, with data persisted in a PostgreSQL database.

## Features

*   User registration and login
*   Create, Read, Update, and Delete (CRUD) operations for todos
*   View a report of todo statuses
*   Log of all user activities

## Getting Started

### Prerequisites

*   Node.js
*   npm
*   Docker and Docker Compose

### Backend Setup

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

### Frontend Setup

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
