import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiBook, FiTrendingUp, FiClock, FiPlay, FiPlusCircle } from 'react-icons/fi';
import { questionApi } from '../lib/apiClient';
import { CATEGORIES } from '../constants';

const HomePage = () => {
  const { userid, username } = useSelector((state) => state.auth);
  const isLoggedIn = !!userid;
  const [categories, setCategories] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch questions for each category to get counts
        const categoryPromises = CATEGORIES.map(category =>
          questionApi.getQuestions({ category })
        );
        const categoryResults = await Promise.all(categoryPromises);
        
        // Map the results to category objects with counts
        const categoriesWithCounts = categoryResults.map((result, index) => ({
          id: index + 1,
          name: CATEGORIES[index],
          count: result.length || 0,
          icon: FiBook
        }));
        
        setCategories(categoriesWithCounts);

        // Fetch recent questions (last 5)
        const allQuestions = await questionApi.getQuestions();
        const recent = allQuestions
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(q => ({
            id: q._id,
            title: q.description,
            category: q.category,
            difficulty: q.difficulty,
            author: q.author?.username || 'Anonymous',
            timestamp: new Date(q.createdAt).toLocaleDateString()
          }));
        
        setRecentQuestions(recent);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Welcome to VidyaQuest
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Your platform for learning and testing your knowledge
            </p>
            <div className="mt-8 flex justify-center flex-wrap gap-4">
              <Link
                to="/quiz-config"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <FiPlay className="mr-2" />
                Take Quiz
              </Link>
              <Link
                to="/question-bank"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiBook className="mr-2" />
                Browse Questions
              </Link>
              {isLoggedIn && (
                <Link
                  to="/submit-question"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiPlusCircle className="mr-2" />
                  Submit Question
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiBook className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Question Bank</h3>
                <p className="mt-2 text-base text-gray-500">
                  Browse through our extensive collection of questions across various subjects.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiTrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Review & Learn</h3>
                <p className="mt-2 text-base text-gray-500">
                  Review your answers and learn from detailed explanations after each quiz.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiClock className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Timed Quizzes</h3>
                <p className="mt-2 text-base text-gray-500">
                  Test your knowledge under time pressure with our quiz feature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
        {loading ? (
          <div className="text-center py-4">Loading categories...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">{error}</div>
        ) : (
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
        )}
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
        {loading ? (
          <div className="text-center py-4">Loading recent questions...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">{error}</div>
        ) : (
          <div className="space-y-4">
            {recentQuestions.length > 0 ? (
              recentQuestions.map((question) => (
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
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No recent questions available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 