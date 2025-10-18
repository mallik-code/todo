import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ username, password });
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/todos');
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register({ username, password });
            setIsRegister(false);
            setError('');
            alert('Registration successful! Please log in.');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('Username already exists');
            } else {
                setError('Registration failed');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">{isRegister ? 'Register' : 'Login'}</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={isRegister ? handleRegister : handleLogin}>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        data-testid="username-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        data-testid="password-input"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mt-3">
                                    {isRegister ? 'Register' : 'Login'}
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <button className="btn btn-link" onClick={() => setIsRegister(!isRegister)}>
                                    {isRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
