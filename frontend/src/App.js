import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import EntryForm from './pages/EntryForm';
import CustomerList from './pages/CustomerList';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard/entry" replace />} />
          <Route path="entry" element={<EntryForm />} />
          <Route path="customers" element={<CustomerList />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </ThemeProvider>
  );
}

export default App;
