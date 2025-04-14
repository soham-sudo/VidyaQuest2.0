const Question = require('../models/questionModel');
const mongoose = require('mongoose');

// Hardcoded test user ID for development only
const TEST_USER_ID = '65fd97a41f91d6bb0aafcbe9';

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
    try {
        const { category, difficulty } = req.query;
        let query = {};

        // Apply filters if provided
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        const questions = await Question.find(query)
            .populate('submittedBy', 'username')
            .sort({ createdAt: -1 });

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
const getQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('submittedBy', 'username');

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
    try {
        const {
            description,
            options,
            solution,
            difficulty,
            category
        } = req.body;

        // Validate required fields
        if (!description || !options || !solution || !difficulty || !category) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Validate that exactly one option is correct
        const correctOptions = options.filter(opt => opt.isCorrect);
        if (correctOptions.length !== 1) {
            return res.status(400).json({ message: 'Exactly one option must be marked as correct' });
        }

        // Validate difficulty
        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(difficulty)) {
            return res.status(400).json({ message: 'Invalid difficulty level' });
        }

        // Create question
        const question = await Question.create({
            description,
            options,
            solution,
            difficulty,
            category,
            submittedBy: req.user._id
        });

        res.status(201).json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getQuestions,
    getQuestion,
    createQuestion
}; 