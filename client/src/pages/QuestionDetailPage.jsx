import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiXCircle, FiEye, FiEyeOff, FiBook } from 'react-icons/fi';
import { questionApi } from '../lib/apiClient';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  
  // Get related questions from location state or fetch them
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get filters from query params
  const queryParams = new URLSearchParams(location.search);
  const filters = {
    category: queryParams.get('category') || '',
    difficulty: queryParams.get('difficulty') || '',
    search: queryParams.get('search') || '',
  };

  // Fetch question by ID
  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const data = await questionApi.getQuestion(id);
        setQuestion(data);
        setError('');
        setShowAnswer(false);
        setSelectedOption(null);
        setIsCorrect(null);
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load question. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  // Fetch related questions if needed
  useEffect(() => {
    // If we already have relatedQuestions from state, use those
    if (location.state?.relatedQuestions) {
      setRelatedQuestions(location.state.relatedQuestions);
      
      // Find the current index
      const index = location.state.relatedQuestions.findIndex(q => q._id === id);
      setCurrentIndex(index !== -1 ? index : 0);
      return;
    }

    // Otherwise fetch related questions based on filters
    const fetchRelatedQuestions = async () => {
      try {
        const data = await questionApi.getQuestions(filters);
        setRelatedQuestions(data);
        
        // Find the current index
        const index = data.findIndex(q => q._id === id);
        setCurrentIndex(index !== -1 ? index : 0);
      } catch (err) {
        console.error('Error fetching related questions:', err);
      }
    };

    fetchRelatedQuestions();
  }, [id, location.state, filters]);

  // Format timestamp to relative time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
  };

  // Handle option selection
  const handleOptionSelect = (index) => {
    if (showAnswer) return; // Don't allow changes if answer is shown
    
    setSelectedOption(index);
    
    // Check if the selected option is correct
    if (question && question.options) {
      setIsCorrect(question.options[index].isCorrect);
    }
  };

  // Toggle show/hide answer
  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  // Navigate to previous question
  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevQuestion = relatedQuestions[currentIndex - 1];
      navigate(`/questions/${prevQuestion._id}${location.search}`, {
        state: { relatedQuestions }
      });
    }
  };

  // Navigate to next question
  const goToNext = () => {
    if (currentIndex < relatedQuestions.length - 1) {
      const nextQuestion = relatedQuestions[currentIndex + 1];
      navigate(`/questions/${nextQuestion._id}${location.search}`, {
        state: { relatedQuestions }
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-4">
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-4">
        <div className="bg-red-50 shadow-sm rounded-lg p-6 border border-red-200">
          <p className="text-red-600">{error}</p>
          <Link 
            to="/question-bank" 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Question Bank
          </Link>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto mt-4">
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <p className="text-gray-600">Question not found.</p>
          <Link 
            to="/question-bank" 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Question Bank
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-4 space-y-4">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/question-bank" 
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiArrowLeft className="mr-1" /> Back to Questions
          </Link>
          
          <div className="flex space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex <= 0}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md ${
                currentIndex <= 0 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <FiArrowLeft className="mr-1" /> Previous
            </button>
            
            <button
              onClick={goToNext}
              disabled={currentIndex >= relatedQuestions.length - 1}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md ${
                currentIndex >= relatedQuestions.length - 1 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              Next <FiArrowRight className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Question Details */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{question.description}</h1>
          
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
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
        </div>

        {/* Options */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Options</h2>
            <button
              onClick={toggleShowAnswer}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {showAnswer ? (
                <>
                  <FiEyeOff className="mr-1" /> Hide Answer
                </>
              ) : (
                <>
                  <FiEye className="mr-1" /> Show Answer
                </>
              )}
            </button>
          </div>

          <div className="space-y-2 mt-3">
            {question.options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`p-3 border rounded-md cursor-pointer ${
                  selectedOption === index && !showAnswer
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${
                  showAnswer && option.isCorrect
                    ? 'border-green-500 bg-green-50'
                    : showAnswer && selectedOption === index && !option.isCorrect
                    ? 'border-red-500 bg-red-50'
                    : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    {showAnswer && option.isCorrect ? (
                      <FiCheckCircle className="h-5 w-5 text-green-500" />
                    ) : showAnswer && selectedOption === index && !option.isCorrect ? (
                      <FiXCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <div className={`h-5 w-5 border-2 rounded-full ${
                        selectedOption === index ? 'border-indigo-500' : 'border-gray-300'
                      }`} />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${
                      showAnswer && option.isCorrect
                        ? 'font-medium text-green-700'
                        : showAnswer && selectedOption === index && !option.isCorrect
                        ? 'font-medium text-red-700'
                        : 'text-gray-700'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {showAnswer && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-md font-medium text-gray-900">Explanation</h3>
            <p className="mt-2 text-sm text-gray-600">{question.solution}</p>
          </div>
        )}

        {/* Result Feedback */}
        {isCorrect !== null && !showAnswer && (
          <div className={`mt-6 p-4 rounded-md ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {isCorrect ? (
                  <FiCheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <FiXCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </h3>
                <div className="mt-2 text-sm">
                  <button
                    onClick={toggleShowAnswer}
                    className={`font-medium ${
                      isCorrect ? 'text-green-700 hover:text-green-600' : 'text-red-700 hover:text-red-600'
                    }`}
                  >
                    Show explanation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls for mobile */}
      <div className="md:hidden bg-white shadow-sm rounded-lg p-4">
        <div className="flex justify-between">
          <button
            onClick={goToPrevious}
            disabled={currentIndex <= 0}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md ${
              currentIndex <= 0 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <FiArrowLeft className="mr-1" /> Previous
          </button>
          
          <button
            onClick={goToNext}
            disabled={currentIndex >= relatedQuestions.length - 1}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md ${
              currentIndex >= relatedQuestions.length - 1 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Next <FiArrowRight className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage; 