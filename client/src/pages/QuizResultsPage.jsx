import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiRefreshCw, FiHome, FiArrowLeft, FiClock, FiCheckCircle, FiAlertCircle, FiFilter } from 'react-icons/fi';
import { quizApi } from '../lib/apiClient';
import { CATEGORIES } from '../constants';

const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const submitQuiz = async () => {
      if (!location.state || !location.state.quizData) {
        setError('No quiz data found. Please take a quiz first.');
        setLoading(false);
        return;
      }

      try {
        const response = await quizApi.submitQuiz(location.state.quizData);
        setResults(response);
        setError('');
      } catch (err) {
        console.error('Error submitting quiz:', err);
        setError('Failed to submit quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    submitQuiz();
  }, [location.state]);

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return 'Excellent! Keep up the great work!';
    if (percentage >= 60) return 'Good job! You can do even better!';
    return 'Keep practicing! You\'ll improve with time.';
  };

  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getQuestionStatus = (question) => {
    if (!question.selectedOption) return 'unattempted';
    return question.isCorrect ? 'correct' : 'incorrect';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct': return 'text-green-600';
      case 'incorrect': return 'text-red-600';
      case 'unattempted': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'correct': return 'bg-green-50 border-green-200';
      case 'incorrect': return 'bg-red-50 border-red-200';
      case 'unattempted': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 shadow-sm rounded-lg p-6 border border-red-200">
          <p className="text-red-600">{error}</p>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => navigate('/quiz-config')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/question-bank')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiHome className="mr-2 h-4 w-4" />
              Back to Questions
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-yellow-50 shadow-sm rounded-lg p-6 border border-yellow-200">
          <p className="text-yellow-600">No results found.</p>
          <button
            onClick={() => navigate('/quiz-config')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Take a Quiz
          </button>
        </div>
      </div>
    );
  }

  const { summary, questions } = results;
  const percentage = summary.percentage;
  const attemptedCount = questions.filter(q => q.selectedOption).length;
  const unattemptedCount = questions.length - attemptedCount;
  const correctCount = questions.filter(q => q.isCorrect).length;
  const incorrectCount = attemptedCount - correctCount;
  
  // Group questions by category for subject-wise analysis
  const categoryStats = questions.reduce((acc, question) => {
    const category = question.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { total: 0, correct: 0, attempted: 0 };
    }
    acc[category].total += 1;
    if (question.selectedOption) {
      acc[category].attempted += 1;
      if (question.isCorrect) {
        acc[category].correct += 1;
      }
    }
    return acc;
  }, {});

  // Get unique categories for filter
  const categories = ['all', ...CATEGORIES];

  // Filter questions based on selected category and status
  const filteredQuestions = questions.filter(question => {
    const questionCategory = question.category || 'Uncategorized';
    const questionStatus = getQuestionStatus(question);
    
    const categoryMatch = selectedCategory === 'all' || questionCategory === selectedCategory;
    const statusMatch = selectedStatus === 'all' || questionStatus === selectedStatus;
    
    return categoryMatch && statusMatch;
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Results</h1>
          
          {/* Score Circle */}
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
              <circle
                className={`${getScoreColor(percentage)}`}
                strokeWidth="10"
                strokeDasharray={`${percentage * 2.83} 283`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute">
              <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                {percentage}%
              </span>
            </div>
          </div>

          {/* Score Details */}
          <div className="mb-6">
            <p className="text-lg text-gray-600 mb-2">
              You got {correctCount} out of {questions.length} questions correct
            </p>
            <p className="text-lg font-medium text-gray-900">
              {getScoreMessage(percentage)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/question-bank')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiHome className="mr-2 h-4 w-4" />
              Back to Questions
            </button>
            <button
              onClick={() => navigate('/quiz-config')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
          
          {/* Attempted vs Unattempted */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Question Attempts</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-700 font-medium">Attempted</span>
                  <span className="text-green-700 font-bold">{attemptedCount}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${(attemptedCount / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">Unattempted</span>
                  <span className="text-gray-700 font-bold">{unattemptedCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gray-500 h-2.5 rounded-full" 
                    style={{ width: `${(unattemptedCount / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Correct vs Incorrect */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Answer Accuracy</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-700 font-medium">Correct</span>
                  <span className="text-green-700 font-bold">{correctCount}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${(correctCount / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-700 font-medium">Incorrect</span>
                  <span className="text-red-700 font-bold">{incorrectCount}</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full" 
                    style={{ width: `${(incorrectCount / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subject-wise Performance */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Subject-wise Performance</h3>
            <div className="space-y-4">
              {Object.entries(categoryStats).map(([category, stats]) => {
                const accuracy = stats.attempted > 0 
                  ? Math.round((stats.correct / stats.attempted) * 100) 
                  : 0;
                const barColor = getBarColor(accuracy);
                
                return (
                  <div key={category} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{category}</span>
                      <span className={`font-bold ${getScoreColor(accuracy)}`}>
                        {accuracy}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${barColor} h-2.5 rounded-full`} 
                        style={{ width: `${accuracy}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {stats.correct} correct out of {stats.attempted} attempted
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Question Review</h2>
            <div className="flex items-center space-x-2">
            </div>
          </div>
          
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                Category:
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All</option>
                <option value="correct">Correct</option>
                <option value="incorrect">Incorrect</option>
                <option value="unattempted">Unattempted</option>
              </select>
            </div>
          </div>
          
          {/* Filtered Questions Count */}
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredQuestions.length} of {questions.length} questions
          </div>
          
          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((question, index) => {
              const status = getQuestionStatus(question);
              const statusColor = getStatusColor(status);
              const statusBgColor = getStatusBgColor(status);
              
              return (
                <div key={question.questionId} className={`p-4 border rounded-lg ${statusBgColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">
                      {index + 1}. {question.description}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                        {question.category || 'Uncategorized'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${status === 'correct' ? 'bg-green-100 text-green-800' : status === 'incorrect' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    {question.options.map((option) => (
                      <div 
                        key={option._id} 
                        className={`p-2 rounded ${
                          option.isCorrect 
                            ? 'bg-green-50 border border-green-200' 
                            : question.selectedOption && question.selectedOption._id === option._id
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          {option.isCorrect ? (
                            <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                          ) : question.selectedOption && question.selectedOption._id === option._id ? (
                            <FiX className="h-4 w-4 text-red-500 mr-2" />
                          ) : null}
                          {option.description}
                        </div>
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                      <span className="font-medium">Explanation:</span> {question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tips to Improve</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Review the explanations</p>
                <p className="text-sm text-gray-500">
                  Take time to understand why each answer is correct or incorrect.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Practice regularly</p>
                <p className="text-sm text-gray-500">
                  Consistent practice helps reinforce your understanding of the concepts.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Focus on weak areas</p>
                <p className="text-sm text-gray-500">
                  Identify topics where you need more practice and focus on those areas.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage; 