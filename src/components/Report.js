import React, { useState, useEffect } from 'react';
import { getTodos } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Report = () => {
    const [todos, setTodos] = useState([]);
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

    const getReport = () => {
        const totalTodos = todos.length;
        const completedTodos = todos.filter(todo => todo.status === 'Completed').length;
        const inProgressTodos = todos.filter(todo => todo.status === 'In Progress').length;
        const notStartedTodos = todos.filter(todo => todo.status === 'Not Started').length;

        return {
            totalTodos,
            completedTodos,
            inProgressTodos,
            notStartedTodos
        };
    };

    const report = getReport();

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
                                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                            </li>
                             <li className="nav-item ms-2">
                                <button className="btn btn-outline-primary" onClick={() => navigate('/todos')}>Todo List</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <h2>Report</h2>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Todo Summary</h5>
                        <p className="card-text" data-testid="total-todos">Total Todos: {report.totalTodos}</p>
                        <p className="card-text" data-testid="completed-todos">Completed Todos: {report.completedTodos}</p>
                        <p className="card-text" data-testid="in-progress-todos">In Progress Todos: {report.inProgressTodos}</p>
                        <p className="card-text" data-testid="not-started-todos">Not Started Todos: {report.notStartedTodos}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;