import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiPlus, FiX, FiAlertTriangle } from 'react-icons/fi';
import { questionApi } from '../lib/apiClient';
import { useToast } from '../components/ui/Toast';
import { CATEGORIES } from '../constants';

const SubmitQuestionPage = () => {
  const navigate = useNavigate();
  const { successToast } = useToast();
  const [formData, setFormData] = useState({
    description: '',
    options: ['', '', '', ''],
    solution: '',
    difficulty: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAuthError(false);
    setLoading(true);

    // Validate form
    if (!formData.correctAnswer) {
      setError('Please select a correct answer');
      setLoading(false);
      return;
    }

    try {
      // Format data for API - match server model field names
      const questionData = {
        description: formData.question,
        category: formData.category,
        difficulty: formData.difficulty.toLowerCase(),
        options: formData.options.map((text, index) => ({
          description: text, // Changed from 'text' to 'description' to match server model
          isCorrect: index.toString() === formData.correctAnswer
        })),
        solution: formData.explanation
      };

      console.log('Submitting question:', questionData);

      // Submit question via API
      await questionApi.createQuestion(questionData);
      
      // On success - show success message and reset form
      setFormData({
        description: '',
        options: ['', '', '', ''],
        solution: '',
        difficulty: '',
        category: '',
      });
      setError('');
      successToast('Question submitted successfully!');
    } catch (err) {
      console.error('Error submitting question:', err);
      
      // Check if it's an authentication error
      if (err.response && err.response.status === 401) {
        setAuthError(true);
      } else {
        let errorMessage = 'Failed to submit question. Please try again.';
        
        if (err.response) {
          errorMessage = err.response.data?.message || errorMessage;
          console.log('Response error:', err.response.status, err.response.data);
        } else if (err.request) {
          errorMessage = 'No response from server. Please check your connection.';
          console.log('Request error:', err.request);
        } else {
          console.log('Error:', err.message);
        }
        
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, show auth error UI
  if (authError) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="text-center">
            <FiAlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Authentication Required</h2>
            <p className="mt-1 text-sm text-gray-500">
              You need to be logged in to submit questions.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Up
              </Link>
              <button
                type="button"
                onClick={() => navigate('/question-bank')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit a Question</h1>
        <p className="text-gray-600 mb-6">
          Contribute to our question bank by submitting your own questions.
        </p>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select difficulty</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">
              Question Text
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              required
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  value={index}
                  checked={formData.correctAnswer === index.toString()}
                  onChange={(e) => setFormData((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label className="text-sm text-gray-500">Correct</label>
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
              Explanation
            </label>
            <textarea
              id="explanation"
              name="explanation"
              value={formData.explanation}
              onChange={handleInputChange}
              required
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Explain why the correct answer is right and why the other options are wrong"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/question-bank')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Submitting...' : 'Submit Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitQuestionPage; 