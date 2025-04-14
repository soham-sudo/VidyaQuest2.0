const Question = require('../models/questionModel');

// @desc    Get quiz questions
// @route   GET /api/quiz
// @access  Private
const getQuizQuestions = async (req, res) => {
    try {
        const { categories, limit = 10 } = req.query;
        let query = {};

        // Apply category filter if provided
        if (categories) {
            // Handle both single category and multiple categories
            const categoryArray = Array.isArray(categories) 
                ? categories 
                : [categories];
            
            query.category = { $in: categoryArray };
        }

        // Count available questions matching the criteria
        const availableCount = await Question.countDocuments(query);
        
        // Determine how many questions to return
        const requestedLimit = parseInt(limit);
        const actualLimit = Math.min(requestedLimit, availableCount);

        // Get random questions
        const questions = await Question.aggregate([
            { $match: query },
            { $sample: { size: actualLimit } },
            {
                $project: {
                    _id: 1,
                    description: 1,
                    options: {
                        $map: {
                            input: "$options",
                            as: "option",
                            in: {
                                _id: "$$option._id",
                                description: "$$option.description"
                            }
                        }
                    },
                    category: 1,
                    difficulty: 1
                }
            }
        ]);

        res.json({
            questions,
            totalAvailable: availableCount,
            requested: requestedLimit,
            returned: questions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit quiz answers
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
    try {
        const { answers, questions } = req.body;

        // Validate inputs
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: 'Questions array is required' });
        }

        if (!Array.isArray(answers)) {
            return res.status(400).json({ message: 'Answers array is required' });
        }

        let score = 0;
        const allQuestions = [];

        // Process each question in original order
        for (const question of questions) {
            const answer = answers.find(a => a.questionId === question._id);
            const questionData = await Question.findById(question._id);

            if (!questionData) {
                return res.status(404).json({ message: `Question ${question._id} not found` });
            }

            if (!answer) {
                // Question was not attempted
                allQuestions.push({
                    questionId: question._id,
                    description: questionData.description,
                    options: questionData.options.map(opt => ({
                        _id: opt._id,
                        description: opt.description,
                        isCorrect: opt.isCorrect
                    })),
                    category: questionData.category,
                    difficulty: questionData.difficulty,
                    status: 'unattempted',
                    selectedOption: null,
                    correctOption: questionData.options.find(opt => opt.isCorrect),
                    explanation: questionData.solution,
                    isCorrect: false
                });
                continue;
            }

            // Find the selected option
            const selectedOption = questionData.options.find(
                opt => opt._id.toString() === answer.selectedOptionId
            );

            if (!selectedOption) {
                return res.status(400).json({ 
                    message: `Invalid option selected for question ${question._id}` 
                });
            }

            // Check if answer is correct
            const isCorrect = selectedOption.isCorrect;
            if (isCorrect) score++;

            // Add to results maintaining original order
            allQuestions.push({
                questionId: question._id,
                description: questionData.description,
                options: questionData.options.map(opt => ({
                    _id: opt._id,
                    description: opt.description,
                    isCorrect: opt.isCorrect
                })),
                category: questionData.category,
                difficulty: questionData.difficulty,
                status: isCorrect ? 'correct' : 'incorrect',
                selectedOption: {
                    _id: selectedOption._id,
                    description: selectedOption.description
                },
                correctOption: questionData.options.find(opt => opt.isCorrect),
                explanation: questionData.solution,
                isCorrect
            });
        }

        // Calculate statistics
        const totalQuestions = questions.length;
        const attemptedQuestions = answers.length;
        const unattemptedCount = allQuestions.filter(q => q.status === 'unattempted').length;
        const percentage = (score / attemptedQuestions) * 100;
        const feedback = getFeedback(percentage);

        // Calculate category-wise performance
        const categoryStats = calculateCategoryStats(allQuestions);
        
        // Calculate difficulty-wise performance
        const difficultyStats = calculateDifficultyStats(allQuestions);

        res.json({
            summary: {
                totalQuestions,
                attemptedQuestions,
                unattemptedCount,
                score,
                percentage: Math.round(percentage),
                feedback
            },
            categoryStats,
            difficultyStats,
            questions: allQuestions // Now contains all questions in original order with status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to get feedback based on score
const getFeedback = (percentage) => {
    if (percentage >= 90) return 'Excellent! You are a master!';
    if (percentage >= 75) return 'Great job! You have a good understanding.';
    if (percentage >= 50) return 'Not bad! Keep practicing to improve.';
    if (percentage >= 25) return 'You need more practice. Review the explanations.';
    return 'You might want to review the basics first.';
};

// Helper function to calculate category-wise statistics
const calculateCategoryStats = (results) => {
    const stats = {};
    results.forEach(result => {
        if (!stats[result.category]) {
            stats[result.category] = {
                total: 0,
                correct: 0,
                incorrect: 0,
                percentage: 0
            };
        }
        stats[result.category].total++;
        if (result.status === 'correct') {
            stats[result.category].correct++;
        } else if (result.status === 'incorrect') {
            stats[result.category].incorrect++;
        }
        stats[result.category].percentage = 
            (stats[result.category].correct / stats[result.category].total) * 100;
    });
    return stats;
};

// Helper function to calculate difficulty-wise statistics
const calculateDifficultyStats = (results) => {
    const stats = {
        easy: { total: 0, correct: 0, incorrect: 0, percentage: 0 },
        medium: { total: 0, correct: 0, incorrect: 0, percentage: 0 },
        hard: { total: 0, correct: 0, incorrect: 0, percentage: 0 }
    };

    results.forEach(result => {
        stats[result.difficulty].total++;
        if (result.status === 'correct') {
            stats[result.difficulty].correct++;
        } else if (result.status === 'incorrect') {
            stats[result.difficulty].incorrect++;
        }
        stats[result.difficulty].percentage = 
            (stats[result.difficulty].correct / stats[result.difficulty].total) * 100;
    });

    return stats;
};

module.exports = {
    getQuizQuestions,
    submitQuiz
}; 