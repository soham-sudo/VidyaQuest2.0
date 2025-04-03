const express = require('express');
const router = express.Router();
const { 
    getQuizQuestions, 
    submitQuiz
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// All quiz routes require authentication
router.use(protect);

// Quiz routes
router.get('/', getQuizQuestions);
router.post('/submit', submitQuiz);

module.exports = router; 