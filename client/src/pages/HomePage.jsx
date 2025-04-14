import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiTrendingUp, FiClock, FiPlay } from 'react-icons/fi';

const HomePage = () => {
  const categories = [
    { id: 1, name: 'Mathematics', count: 150, icon: FiBook },
    { id: 2, name: 'Physics', count: 120, icon: FiBook },
    { id: 3, name: 'Chemistry', count: 100, icon: FiBook },
    { id: 4, name: 'Biology', count: 80, icon: FiBook },
  ];

  const recentQuestions = [
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

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to VidyaQuest
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Your platform for competitive exam preparation. Practice questions, contribute to the community, and excel in your studies.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/quiz-config"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FiPlay className="mr-2 h-5 w-5" />
            Take Quiz
          </Link>
          <Link
            to="/question-bank"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Browse Questions
          </Link>
          <Link
            to="/submit-question"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Submit Questions
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/question-bank?category=${category.name}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <div className="flex items-center">
                <category.icon className="h-6 w-6 text-indigo-600" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} questions</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Questions Section */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Questions</h2>
          <Link
            to="/question-bank"
            className="text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {recentQuestions.map((question) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{question.title}</h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{question.category}</span>
                    <span>•</span>
                    <span>{question.difficulty}</span>
                    <span>•</span>
                    <span>By {question.author}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiClock className="mr-1 h-4 w-4" />
                  {question.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 