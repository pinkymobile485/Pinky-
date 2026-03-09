import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerForm from './pages/CustomerForm';
import Login from './pages/Login';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <Layout>
              <CustomerList />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/new"
        element={
          <PrivateRoute>
            <Layout>
              <CustomerForm />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <PrivateRoute>
            <Layout>
              <CustomerForm />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Layout>
              <div className="space-y-6">
                <header>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
                  <p className="text-slate-500 dark:text-slate-400">Manage your application.</p>
                </header>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => {
                      localStorage.removeItem('isMobileAuth');
                      window.location.href = '/login';
                    }}
                    className="w-full text-left text-red-600 font-bold p-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/mobile">
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
