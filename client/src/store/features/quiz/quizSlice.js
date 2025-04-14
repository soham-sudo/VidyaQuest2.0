import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { quizApi } from '../../../lib/apiClient';

// Fetch quiz questions
export const fetchQuizQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async (config, { rejectWithValue }) => {
    try {
      const response = await quizApi.getQuizQuestions(config);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

// Submit quiz
export const submitQuiz = createAsyncThunk(
  'quiz/submit',
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await quizApi.submitQuiz(quizData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
    }
  }
);

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  reviewedQuestions: new Set(),
  timeLeft: 0,
  loading: false,
  error: null,
  quizConfig: null,
  results: null
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizConfig: (state, action) => {
      state.quizConfig = action.payload;
    },
    selectAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.selectedAnswers[questionId] = answer;
    },
    toggleReview: (state, action) => {
      const questionId = action.payload;
      if (state.reviewedQuestions.has(questionId)) {
        state.reviewedQuestions.delete(questionId);
      } else {
        state.reviewedQuestions.add(questionId);
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
    resetQuiz: (state) => {
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.reviewedQuestions = new Set();
      state.timeLeft = 0;
      state.loading = false;
      state.error = null;
      state.quizConfig = null;
      state.results = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.timeLeft = action.payload.questions.length * 30; // 30 seconds per question
      })
      .addCase(fetchQuizQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Quiz
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  setQuizConfig,
  selectAnswer,
  toggleReview,
  nextQuestion,
  previousQuestion,
  setTimeLeft,
  resetQuiz
} = quizSlice.actions;

// Selectors
export const selectQuizQuestions = (state) => state.quiz.questions;
export const selectCurrentQuestionIndex = (state) => state.quiz.currentQuestionIndex;
export const selectQuizAnswers = (state) => state.quiz.selectedAnswers;
export const selectQuizTimeLeft = (state) => state.quiz.timeLeft;
export const selectQuizLoading = (state) => state.quiz.loading;
export const selectQuizError = (state) => state.quiz.error;
export const selectQuizConfig = (state) => state.quiz.quizConfig;
export const selectQuizResults = (state) => state.quiz.results;

export default quizSlice.reducer; 