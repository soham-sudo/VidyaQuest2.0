const express = require('express');
const router = express.Router();
const { 
    getQuestions, 
    getQuestion,
    createQuestion
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getQuestions);

// Single question route
router.get('/:id', getQuestion);

// Protected routes (require authentication)
router.post('/', protect, createQuestion);

module.exports = questionRouter; 