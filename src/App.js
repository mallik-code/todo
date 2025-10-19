import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import TodoList from './components/TodoList';
import Report from './components/Report';
import ActivityLog from './components/ActivityLog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/report" element={<Report />} />
        <Route path="/activity" element={<ActivityLog />} />
      </Routes>
    </Router>
  );
}

export default App;