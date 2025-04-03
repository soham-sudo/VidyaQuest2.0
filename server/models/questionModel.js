const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    options: [{
        description: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            required: true
        }
    }],
    solution: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard']
    },
    category: {
        type: String,
        required: true
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
