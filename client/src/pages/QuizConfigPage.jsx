import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiArrowLeft } from 'react-icons/fi';

const QuizConfigPage = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [error, setError] = useState('');

  const categories = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
  ];

  const questionCounts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
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
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Configure Quiz</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {/* Category Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Select Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`p-3 rounded-md border text-left ${
                  selectedCategories.includes(category)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Number of Questions
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {questionCounts.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`p-2 rounded-md border ${
                  questionCount === count
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Start Quiz Button */}
        <div className="flex justify-end">
          <button
            onClick={handleStartQuiz}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlay className="mr-2 h-4 w-4" />
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizConfigPage; 