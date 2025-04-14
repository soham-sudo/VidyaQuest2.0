import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import QuestionBankPage from './pages/QuestionBankPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import SubmitQuestionPage from './pages/SubmitQuestionPage';
import QuizConfigPage from './pages/QuizConfigPage';
import QuizPage from './pages/QuizPage';
import QuizResultsPage from './pages/QuizResultsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { userid } = useSelector((state) => state.auth);
    return userid ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route path="/question-bank" element={
                <ProtectedRoute>
                    <MainLayout>
                        <QuestionBankPage />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/questions/:id" element={
                <ProtectedRoute>
                    <MainLayout>
                        <QuestionDetailPage />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/submit-question" element={
                <ProtectedRoute>
                    <MainLayout>
                        <SubmitQuestionPage />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/quiz-config" element={
                <ProtectedRoute>
                    <MainLayout>
                        <QuizConfigPage />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/quiz" element={
                <ProtectedRoute>
                    <MainLayout>
                        <QuizPage />
                    </MainLayout>
                </ProtectedRoute>
            } />
            <Route path="/quiz-results" element={
                <ProtectedRoute>
                    <MainLayout>
                        <QuizResultsPage />
                    </MainLayout>
                </ProtectedRoute>
            } />

            {/* 404 route */}
            <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
        </Routes>
    );
};

export default AppRoutes; 