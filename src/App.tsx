import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ReportIssuePage from './pages/ReportIssuePage';
import CheckAlertsPage from './pages/CheckAlertsPage';
import AwarenessPage from './pages/AwarenessPage';
import LoginPage from './pages/LoginPage';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WaterQualityPage from './pages/WaterQualityPage';
import NortheastMapPage from './pages/NortheastMapPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/report" element={<ReportIssuePage />} />
                <Route path="/alerts" element={<CheckAlertsPage />} />
                <Route path="/awareness" element={<AwarenessPage />} />
                <Route path="/water-quality" element={<WaterQualityPage />} />
                <Route path="/northeast-map" element={<NortheastMapPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/staff-dashboard"
                  element={
                    <ProtectedRoute requiredRole="staff">
                      <StaffDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;