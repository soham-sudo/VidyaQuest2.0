import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiBook, FiPlus, FiEye } from 'react-icons/fi';
import { questionApi } from '../lib/apiClient';
import { CATEGORIES } from '../constants';

// Dummy questions to show if API fails or for initial display
const dummyQuestions = [
  {
    _id: 1,
    description: 'What is the derivative of x²?',
    category: 'Mathematics',
    difficulty: 'medium',
    submittedBy: { username: 'John Doe' },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    options: [
      { description: '2x', isCorrect: true },
      { description: 'x²', isCorrect: false },
      { description: '1', isCorrect: false },
      { description: '0', isCorrect: false }
    ]
  },
  {
    _id: 2,
    description: 'Explain Newton\'s First Law of Motion',
    category: 'Physics',
    difficulty: 'easy',
    submittedBy: { username: 'Jane Smith' },
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    options: [
      { description: 'An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force', isCorrect: true },
      { description: 'Force equals mass times acceleration', isCorrect: false },
      { description: 'For every action, there is an equal and opposite reaction', isCorrect: false },
      { description: 'Energy cannot be created or destroyed', isCorrect: false }
    ]
  },
  {
    _id: 3,
    description: 'What is the structure of DNA?',
    category: 'Biology',
    difficulty: 'hard',
    submittedBy: { username: 'Mike Johnson' },
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    options: [
      { description: 'Double helix', isCorrect: true },
      { description: 'Single strand', isCorrect: false },
      { description: 'Triple helix', isCorrect: false },
      { description: 'Circular structure', isCorrect: false }
    ]
  },
];

const QuestionBankPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    difficulty: '',
    search: '',
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await questionApi.getQuestions(filters);
        setQuestions(response);
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filters.category, filters.difficulty, filters.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Question Bank
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse and practice questions from various categories and difficulty levels.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 bg-white shadow sm:rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Search Filter */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search questions..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-4">Loading questions...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-600">{error}</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No questions found</div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question._id}
                  className="bg-white shadow sm:rounded-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {question.description}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{question.category}</span>
                        <span>•</span>
                        <span>{question.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBankPage; 