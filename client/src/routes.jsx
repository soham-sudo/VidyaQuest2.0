import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import QuestionBankPage from './pages/QuestionBankPage';
import SubmitQuestionPage from './pages/SubmitQuestionPage';
import QuizPage from './pages/QuizPage';
import QuizResultsPage from './pages/QuizResultsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  
  if (!auth.userid) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/question-bank" element={<MainLayout><QuestionBankPage /></MainLayout>} />
      
      {/* Protected Routes */}
      <Route 
        path="/submit-question" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <SubmitQuestionPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/quiz" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <QuizPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/quiz-results" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <QuizResultsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* 404 Route */}
      <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
    </Routes>
  );
};

export default AppRoutes; 