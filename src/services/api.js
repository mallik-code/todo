import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const login = (credentials) => {
    return axios.post(`${API_URL}/login`, credentials);
};

export const register = (credentials) => {
    return axios.post(`${API_URL}/register`, credentials);
};

export const getTodos = (userId) => {
    return axios.get(`${API_URL}/todos/${userId}`);
};

export const addTodo = (todo) => {
    return axios.post(`${API_URL}/todos`, todo);
};

export const updateTodo = (id, todo) => {
    return axios.put(`${API_URL}/todos/${id}`, todo);
};

export const deleteTodo = (id) => {
    return axios.delete(`${API_URL}/todos/${id}`);
};