import React, { useState, useEffect } from 'react';
import { getActivityLog } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ActivityLog = () => {
    const [activities, setActivities] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchActivities(parsedUser.id);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const fetchActivities = async (userId) => {
        const response = await getActivityLog(userId);
        setActivities(response.data);
    };

    const handleBack = () => {
        navigate('/todos');
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <span className="navbar-brand">Activity Log</span>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {user && <span className="navbar-text me-3">Welcome, {user.username}</span>}
                            <li className="nav-item">
                                <button className="btn btn-outline-primary" onClick={handleBack}>Back to Todos</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <h2>Your Activities</h2>
                <ul className="list-group">
                    {activities.map(activity => (
                        <li key={activity.id} className="list-group-item">
                            <div><strong>{new Date(activity.timestamp).toLocaleString()}:</strong> {activity.action}</div>
                            {activity.old_value && <div><small>Before: {activity.old_value}</small></div>}
                            {activity.new_value && <div><small>After: {activity.new_value}</small></div>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ActivityLog;
