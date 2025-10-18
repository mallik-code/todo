# Full-Stack Todo Application

This is a full-stack todo application with a React frontend and a Node.js/Express backend.

## Features

*   User login
*   Todo list management (add, update, delete)
*   Mark todos as "Not Started", "In Progress", or "Completed"
*   User-wise report of todos

## Technologies

*   **Frontend:** React, Bootstrap
*   **Backend:** Node.js, Express
*   **Testing:** Playwright

## Getting Started

### Prerequisites

*   Node.js and npm installed

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd ../backend
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

### Frontend Setup

1.  Navigate to the `frontend` directory (if you are not already there):
    ```bash
    cd . # Already in frontend directory
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

The project uses Playwright for end-to-end testing.

To run the tests, follow these steps:

1.  Make sure both the backend and frontend servers are running.
2.  Run the tests from the `frontend` directory:
    ```bash
    npx playwright test
    ```

To run the tests in headed mode (with a visible browser), use this command:
```bash
npx playwright test --headed
```