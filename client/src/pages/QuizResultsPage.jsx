import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiRefreshCw, FiHome } from 'react-icons/fi';

const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total } = location.state || { score: 0, total: 0 };
  const percentage = Math.round((score / total) * 100);

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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center">
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
              You got {score} out of {total} questions correct
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
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </button>
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