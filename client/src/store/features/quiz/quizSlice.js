import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendUrl from "../../../constants";

// Async Thunks
export const fetchQuizQuestions = createAsyncThunk(
  "quiz/fetchQuestions",
  async (settings, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/questions/quiz`, { params: settings });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "quiz/submit",
  async (answers, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/api/quiz/submit`, answers);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  currentQuiz: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  score: 0,
  loading: false,
  error: null,
  quizSettings: {
    subject: "",
    difficulty: "",
    numberOfQuestions: 10,
  },
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setCurrentQuestionIndex(state, action) {
      state.currentQuestionIndex = action.payload;
    },
    setAnswer(state, action) {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    setQuizSettings(state, action) {
      state.quizSettings = { ...state.quizSettings, ...action.payload };
    },
    resetQuiz(state) {
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.score = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quiz Questions
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
        state.currentQuestionIndex = 0;
        state.answers = {};
        state.score = 0;
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
        state.score = action.payload.score;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const {
  setCurrentQuestionIndex,
  setAnswer,
  setQuizSettings,
  resetQuiz,
} = quizSlice.actions;

// Selectors
export const selectQuizQuestions = (state) => state.quiz.questions;
export const selectCurrentQuestionIndex = (state) => state.quiz.currentQuestionIndex;
export const selectQuizAnswers = (state) => state.quiz.answers;
export const selectQuizScore = (state) => state.quiz.score;
export const selectQuizLoading = (state) => state.quiz.loading;
export const selectQuizError = (state) => state.quiz.error;
export const selectQuizSettings = (state) => state.quiz.quizSettings;

export default quizSlice.reducer; 