require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5434,
});

const createTables = async () => {
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
    `;
    const createTodosTableQuery = `
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            userId INTEGER NOT NULL,
            task TEXT NOT NULL,
            status VARCHAR(50) NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id)
        );
    `;
    const createActivityLogTableQuery = `
        CREATE TABLE IF NOT EXISTS activity_log (
            id SERIAL PRIMARY KEY,
            userId INTEGER NOT NULL,
            action VARCHAR(255) NOT NULL,
            old_value TEXT,
            new_value TEXT,
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            FOREIGN KEY (userId) REFERENCES users(id)
        );
    `;
    try {
        await pool.query(createUsersTableQuery);
        await pool.query(createTodosTableQuery);
        await pool.query(createActivityLogTableQuery);
        console.log('Tables created or already exist.');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

const logActivity = async (userId, action, oldValue, newValue) => {
    try {
        await pool.query(
            'INSERT INTO activity_log (userId, action, old_value, new_value) VALUES ($1, $2, $3, $4)',
            [userId, action, oldValue, newValue]
        );
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

// API Endpoints

// Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username', [username, password]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            logActivity(user.id, 'Logged in', null, null);
            res.json(user);
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get todos for a user
app.get('/api/todos/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const result = await pool.query('SELECT * FROM todos WHERE userId = $1', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting todos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
    const { userId, task, status } = req.body;
    try {
        const result = await pool.query('INSERT INTO todos (userId, task, status) VALUES ($1, $2, $3) RETURNING *', [userId, task, status]);
        logActivity(userId, `Added a new todo: "${task}"`, null, `Task: ${task}, Status: Not Started`);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
    const todoId = parseInt(req.params.id);
    const { task, status } = req.body;

    try {
        const currentTodoResult = await pool.query('SELECT * FROM todos WHERE id = $1', [todoId]);
        if (currentTodoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        const currentTodo = currentTodoResult.rows[0];
        const newTask = task !== undefined ? task : currentTodo.task;
        const newStatus = status !== undefined ? status : currentTodo.status;

        const result = await pool.query(
            'UPDATE todos SET task = $1, status = $2 WHERE id = $3 RETURNING *',
            [newTask, newStatus, todoId]
        );

        const oldValue = `Task: ${currentTodo.task}, Status: ${currentTodo.status}`;
        const newValue = `Task: ${newTask}, Status: ${newStatus}`;
        logActivity(result.rows[0].userid, 'Updated a todo', oldValue, newValue);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
    const todoId = parseInt(req.params.id);
    try {
        const todoResult = await pool.query('SELECT * FROM todos WHERE id = $1', [todoId]);
        if (todoResult.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        const todo = todoResult.rows[0];
        const result = await pool.query('DELETE FROM todos WHERE id = $1', [todoId]);
        if (result.rowCount > 0) {
            logActivity(todo.userid, `Deleted a todo: "${todo.task}"`, `Task: ${todo.task}, Status: ${todo.status}`, null);
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Reset todos
app.post('/api/reset', async (req, res) => {
    try {
        await pool.query('TRUNCATE TABLE todos, users, activity_log RESTART IDENTITY');
        await pool.query("INSERT INTO users (username, password) VALUES ('user1', 'password1')");
        res.status(204).send();
    } catch (error) {
        console.error('Error resetting database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get activity log for a user
app.get('/api/activity-log/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const result = await pool.query('SELECT * FROM activity_log WHERE userId = $1 ORDER BY timestamp DESC', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting activity log:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    createTables();
});
