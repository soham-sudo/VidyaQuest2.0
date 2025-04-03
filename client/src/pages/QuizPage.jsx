import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock questions data (replace with API call)
  const questions = [
    {
      id: 1,
      title: 'What is the derivative of x²?',
      question: 'Find the derivative of f(x) = x²',
      options: ['x', '2x', 'x²', '2x²'],
      correctAnswer: 1,
      explanation: 'The derivative of x² is 2x using the power rule.',
    },
    {
      id: 2,
      title: 'Newton\'s First Law',
      question: 'Which of the following best describes Newton\'s First Law of Motion?',
      options: [
        'An object in motion stays in motion unless acted upon by an external force',
        'Force equals mass times acceleration',
        'For every action there is an equal and opposite reaction',
        'Energy cannot be created or destroyed',
      ],
      correctAnswer: 0,
      explanation: 'Newton\'s First Law states that an object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.',
    },
  ];

  useEffect(() => {
    // TODO: Fetch questions based on category/difficulty from URL params
    setLoading(false);
  }, [location.search]);

  useEffect(() => {
    if (timeLeft > 0 && !showExplanation) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswer(null);
    }
  }, [timeLeft, showExplanation]);

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      // Quiz completed
      navigate('/quiz-results', { state: { score, total: questions.length } });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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
            {timeLeft}s
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            {currentQuestion.question}
          </h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border ${
                  showExplanation
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : selectedAnswer === index
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                    : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                }`}
                disabled={showExplanation}
              >
                <div className="flex items-center">
                  {showExplanation && (
                    <span className="mr-2">
                      {index === currentQuestion.correctAnswer ? (
                        <FiCheck className="h-5 w-5 text-green-500" />
                      ) : selectedAnswer === index ? (
                        <FiX className="h-5 w-5 text-red-500" />
                      ) : null}
                    </span>
                  )}
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Explanation</h3>
            <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-end">
          {showExplanation ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          ) : (
            <button
              onClick={() => handleAnswer(null)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Skip Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 