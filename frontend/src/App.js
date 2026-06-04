import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AIPredictor from './pages/AIPredictor';
import ComparePage from './pages/ComparePage';

// Dashboards
import BuyerDashboard from './pages/dashboards/BuyerDashboard';
import SellerDashboard from './pages/dashboards/SellerDashboard';
import AgentDashboard from './pages/dashboards/AgentDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AddPropertyPage from './pages/AddPropertyPage';

// Context
export const AuthContext = createContext();
export const ThemeContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [token]);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Protected Route Component
  const ProtectedRoute = ({ children, roles }) => {
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
          <div className="min-h-screen bg-gray-50 dark:bg-dark-200 transition-colors duration-300">
            <Router>
              <Navbar />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/ai-predictor" element={<AIPredictor />} />
                <Route path="/compare" element={<ComparePage />} />

                {/* Protected Routes */}
                <Route path="/add-property" element={
                  <ProtectedRoute roles={['seller', 'agent', 'admin']}>
                    <AddPropertyPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/buyer" element={
                  <ProtectedRoute roles={['buyer']}><BuyerDashboard /></ProtectedRoute>
                } />
                <Route path="/dashboard/seller" element={
                  <ProtectedRoute roles={['seller']}><SellerDashboard /></ProtectedRoute>
                } />
                <Route path="/dashboard/agent" element={
                  <ProtectedRoute roles={['agent']}><AgentDashboard /></ProtectedRoute>
                } />
                <Route path="/dashboard/admin" element={
                  <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
                } />
              </Routes>
              <Footer />
            </Router>
            <Toaster position="top-right" />
          </div>
        </div>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
