import React, { useState, useEffect } from 'react';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../services/api';
import { useNavigate } from 'react-router-dom';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchTodos(parsedUser.id);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const fetchTodos = async (userId) => {
        const response = await getTodos(userId);
        setTodos(response.data);
    };

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (task.trim()) {
            const newTodo = { userId: user.id, task, status: 'Not Started' };
            const response = await addTodo(newTodo);
            setTodos([...todos, response.data]);
            setTask('');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        const updatedTodo = { status };
        const response = await updateTodo(id, updatedTodo);
        setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    };

    const handleDeleteTodo = async (id) => {
        await deleteTodo(id);
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <span className="navbar-brand">Todo App</span>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {user && <span className="navbar-text me-3">Welcome, {user.username}</span>}
                            <li className="nav-item">
                                <button className="btn btn-outline-danger" onClick={handleLogout} data-testid="logout-button">Logout</button>
                            </li>
                             <li className="nav-item ms-2">
                                <button className="btn btn-outline-primary" onClick={() => navigate('/report')} data-testid="report-button">Report</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <h2>Todo List</h2>
                <form onSubmit={handleAddTodo} className="mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="New task"
                            data-testid="new-task-input"
                        />
                        <button type="submit" className="btn btn-primary" data-testid="add-todo-button">Add Todo</button>
                    </div>
                </form>
                <ul className="list-group">
                    {todos.map(todo => (
                        <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center" data-testid={`todo-item-${todo.id}`}>
                            {todo.task}
                            <div>
                                <span className={`badge me-2 ${
                                    todo.status === 'Completed' ? 'bg-success' :
                                    todo.status === 'In Progress' ? 'bg-warning' : 'bg-secondary'
                                }`} data-testid={`todo-status-${todo.id}`}>{todo.status}</span>
                                <button className="btn btn-sm btn-info me-2" onClick={() => handleUpdateStatus(todo.id, 'In Progress')} data-testid={`start-button-${todo.id}`}>Start</button>
                                <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdateStatus(todo.id, 'Completed')} data-testid={`done-button-${todo.id}`}>Done</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTodo(todo.id)} data-testid={`delete-button-${todo.id}`}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TodoList;