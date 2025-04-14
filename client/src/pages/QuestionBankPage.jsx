import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiBook, FiPlus, FiEye } from 'react-icons/fi';
import { questionApi } from '../lib/apiClient';

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
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') || '',
    search: searchParams.get('search') || '',
  });
  const [questions, setQuestions] = useState(dummyQuestions); // Initialize with dummy questions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Fetch questions on initial load and when filters change
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const data = await questionApi.getQuestions(filters);
        setQuestions(data.length > 0 ? data : dummyQuestions);
        setError('');
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Using sample questions instead.');
        setQuestions(dummyQuestions);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filters.category, filters.difficulty, filters.search]); // Specify exact dependencies

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Question Bank</h1>
            <p className="text-gray-600">
              Browse and practice questions from various categories and difficulty levels.
            </p>
          </div>
          <Link
            to="/submit-question"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="mr-2" /> Submit Question
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search questions..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Difficulties</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <p className="text-gray-600">Loading questions...</p>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 shadow-sm rounded-lg p-6 border border-yellow-200">
          <p className="text-yellow-600">{error}</p>
        </div>
      )}

      {/* Questions List */}
      {!loading && questions.length === 0 && (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <p className="text-gray-600">No questions found. Try different filters or submit your own questions.</p>
          <Link
            to="/submit-question"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPlus className="mr-2" /> Submit Question
          </Link>
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {questions.map((question) => (
            <div
              key={question._id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link to={`/questions/${question._id}?${searchParams.toString()}`} 
                        state={{ relatedQuestions: questions }}
                        className="group">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                      {question.description}
                    </h3>
                  </Link>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FiBook className="mr-1 h-4 w-4" />
                      {question.category}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{question.difficulty}</span>
                    <span>•</span>
                    <span>By {question.submittedBy?.username || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{question.createdAt ? formatTimestamp(question.createdAt) : 'Recently'}</span>
                  </div>
                  
                  {/* Preview of options */}
                  <div className="mt-2 text-sm text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      {question.options && question.options.slice(0, 2).map((option, index) => (
                        <li key={index} className={option.isCorrect ? "text-green-600 font-medium" : ""}>
                          {option.description} {option.isCorrect && "(Correct)"}
                        </li>
                      ))}
                      {question.options && question.options.length > 2 && (
                        <li className="text-gray-500 italic">...and {question.options.length - 2} more options</li>
                      )}
                    </ul>
                  </div>
                </div>
                <Link
                  to={`/questions/${question._id}?${searchParams.toString()}`}
                  state={{ relatedQuestions: questions }}
                  className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiEye className="mr-1" /> View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionBankPage; 