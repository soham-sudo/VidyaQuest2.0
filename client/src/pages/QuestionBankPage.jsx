import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiBook } from 'react-icons/fi';

const QuestionBankPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') || '',
    search: searchParams.get('search') || '',
  });

  const categories = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const questions = [
    {
      id: 1,
      title: 'What is the derivative of x²?',
      category: 'Mathematics',
      difficulty: 'Medium',
      author: 'John Doe',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      title: 'Explain Newton\'s First Law of Motion',
      category: 'Physics',
      difficulty: 'Easy',
      author: 'Jane Smith',
      timestamp: '3 hours ago',
    },
    {
      id: 3,
      title: 'What is the structure of DNA?',
      category: 'Biology',
      difficulty: 'Hard',
      author: 'Mike Johnson',
      timestamp: '5 hours ago',
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Question Bank</h1>
        <p className="text-gray-600">
          Browse and practice questions from various categories and difficulty levels.
        </p>
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

      {/* Questions List */}
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {questions.map((question) => (
          <div
            key={question.id}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {question.title}
                </h3>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <FiBook className="mr-1 h-4 w-4" />
                    {question.category}
                  </span>
                  <span>•</span>
                  <span>{question.difficulty}</span>
                  <span>•</span>
                  <span>By {question.author}</span>
                </div>
              </div>
              <button
                className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Practice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBankPage; 