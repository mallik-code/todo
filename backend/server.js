const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory data
let users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

const initialTodos = [
    { id: 1, userId: 1, task: 'Create a frontend', status: 'Completed' },
    { id: 2, userId: 1, task: 'Create a backend', status: 'In Progress' },
    { id: 3, userId: 2, task: 'Deploy the application', status: 'Not Started' }
];

let todos = [...initialTodos];

// API Endpoints

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ id: user.id, username: user.username });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Get todos for a user
app.get('/api/todos/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userTodos = todos.filter(t => t.userId === userId);
    res.json(userTodos);
});

// Add a new todo
app.post('/api/todos', (req, res) => {
    const newTodo = {
        id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
        ...req.body
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Update a todo
app.put('/api/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex !== -1) {
        todos[todoIndex] = { ...todos[todoIndex], ...req.body };
        res.json(todos[todoIndex]);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

// Reset todos
app.post('/api/reset', (req, res) => {
    todos = [...initialTodos];
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});