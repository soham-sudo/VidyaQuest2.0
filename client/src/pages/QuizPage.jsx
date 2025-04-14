import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiClock, FiArrowLeft, FiArrowRight, FiList, FiCheckCircle, FiFlag } from 'react-icons/fi';
import { quizApi } from '../lib/apiClient';

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // Will be set based on question count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [quizConfig, setQuizConfig] = useState(null);
  const [reviewedQuestions, setReviewedQuestions] = useState(new Set());

  // Get quiz configuration from location state
  useEffect(() => {
    if (location.state && location.state.categories && location.state.questionCount) {
      setQuizConfig(location.state);
      // Set timer based on question count (30 seconds per question)
      setTimeLeft(location.state.questionCount * 30);
    } else {
      // If no configuration, redirect to quiz config page
      navigate('/quiz-config');
    }
  }, [location.state, navigate]);

  // Fetch questions when quiz configuration is available
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!quizConfig) return;

      setLoading(true);
      try {
        const response = await quizApi.getQuizQuestions({
          categories: quizConfig.categories,
          limit: quizConfig.questionCount
        });
        
        setQuestions(response.questions);
        setError('');
      } catch (err) {
        console.error('Error fetching quiz questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizConfig]);

  // Timer effect for the entire quiz
  useEffect(() => {
    if (timeLeft > 0 && !showReview) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, showReview]);

  const handleAnswer = (optionId) => {
    if (showReview) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion._id]: optionId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Last question, show review option
      setShowReview(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Prepare data for submission
    const answers = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId
    }));

    const quizData = {
      questions: questions.map(q => ({ _id: q._id })),
      answers
    };

    // Navigate to results page with quiz data
    navigate('/quiz-results', { 
      state: { 
        quizData,
        totalQuestions: questions.length,
        answeredQuestions: answers.length
      } 
    });
  };

  const handleReview = () => {
    setShowReview(true);
  };

  const handleBackToQuestion = () => {
    setShowReview(false);
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    setShowReview(false);
  };

  const toggleReviewQuestion = (questionId) => {
    setReviewedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getQuestionStatus = (question) => {
    if (reviewedQuestions.has(question._id)) {
      return 'review';
    }
    if (selectedAnswers[question._id]) {
      return 'attempted';
    }
    return 'unattempted';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 shadow-sm rounded-lg p-6 border border-red-200">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/quiz-config')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-yellow-50 shadow-sm rounded-lg p-6 border border-yellow-200">
          <p className="text-yellow-600">No questions found for the selected categories.</p>
          <button
            onClick={() => navigate('/quiz-config')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Try Different Categories
          </button>
        </div>
      </div>
    );
  }

  // Review mode
  if (showReview) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Review Your Answers</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Time Remaining: {formatTime(timeLeft)}
              </div>
              <button
                onClick={handleBackToQuestion}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Back to Question
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {questions.map((question, index) => {
              const selectedOptionId = selectedAnswers[question._id];
              const selectedOption = question.options.find(opt => opt._id === selectedOptionId);
              const status = getQuestionStatus(question);
              
              return (
                <div 
                  key={question._id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    status === 'review' 
                      ? 'bg-purple-50 border-purple-200' 
                      : status === 'attempted'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                  }`}
                  onClick={() => handleQuestionClick(index)}
                >
                  <div className="font-medium mb-2">
                    {index + 1}. {question.description}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedOption 
                      ? `Selected: ${selectedOption.description}` 
                      : 'Not answered'}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReviewQuestion(question._id);
                    }}
                    className={`mt-2 text-sm ${
                      status === 'review' 
                        ? 'text-purple-600 hover:text-purple-700' 
                        : 'text-gray-600 hover:text-gray-700'
                    }`}
                  >
                    {status === 'review' ? 'Remove from Review' : 'Mark for Review'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBackToQuestion}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Question
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FiCheckCircle className="mr-2 h-4 w-4" />
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionId = selectedAnswers[currentQuestion._id];
  const isMarkedForReview = reviewedQuestions.has(currentQuestion._id);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        {/* Progress and Timer */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FiClock className="mr-1 h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Questions List */}
        <div className="mb-6 flex flex-wrap gap-2">
          {questions.map((question, index) => {
            const status = getQuestionStatus(question);
            return (
              <button
                key={question._id}
                onClick={() => handleQuestionClick(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === currentQuestionIndex
                    ? 'ring-2 ring-indigo-500'
                    : ''
                } ${
                  status === 'review'
                    ? 'bg-purple-100 text-purple-700'
                    : status === 'attempted'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            {currentQuestion.description}
          </h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option._id}
                onClick={() => handleAnswer(option._id)}
                className={`w-full text-left p-4 rounded-lg border ${
                  selectedOptionId === option._id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                {option.description}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <div>
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => toggleReviewQuestion(currentQuestion._id)}
              className={`inline-flex items-center px-4 py-2 border ${
                isMarkedForReview
                  ? 'border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              } text-sm font-medium rounded-md`}
            >
              <FiFlag className="mr-2 h-4 w-4" />
              {isMarkedForReview ? 'Unmark Review' : 'Mark for Review'}
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleReview}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiList className="mr-2 h-4 w-4" />
                Review List
              </button>
            ) : null}
            
            <button
              onClick={handleNext}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Review'}
              <FiArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 