import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Mood from './pages/Mood';
import Review from './pages/Review';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  if (!user) return <Navigate to="/login" />;
  if (!user.userType && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route outside layout so it doesn't have the sidebar */}
        <Route path="/home" element={<LandingPage />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/mood" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
          <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
