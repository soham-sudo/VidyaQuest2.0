import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { FiPlay, FiArrowLeft } from 'react-icons/fi';

const QuizConfigPage = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [error, setError] = useState('');

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  const handleStartQuiz = () => {
    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      return;
    }

    // Navigate to quiz page with selected categories and question count
    navigate('/quiz', {
      state: {
        categories: selectedCategories,
        questionCount,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Configure Your Quiz
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Select categories and number of questions for your quiz
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          {/* Category Selection */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Select Categories
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`p-4 rounded-lg border ${
                    selectedCategories.includes(category)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 hover:border-indigo-500'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="mt-6 bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Number of Questions
            </h2>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {[5, 10, 15, 20, 25, 30].map((count) => (
                <option key={count} value={count}>
                  {count} questions
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mt-4 text-red-600 text-center">{error}</div>
          )}

          <div className="mt-6">
            <button
              onClick={handleStartQuiz}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizConfigPage; 