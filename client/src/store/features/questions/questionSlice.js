import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendUrl from "../../../constants";
// Async Thunks
export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/questions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getQuestion = createAsyncThunk(
  "questions/getQuestion",
  async (questionId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/questions/${questionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createQuestion = createAsyncThunk(
  "questions/createQuestion",
  async (questionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/api/questions`, questionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  questions: [],
  loading: false,
  error: null,
  currentQuestion: null,
  filters: {
    subject: "",
    difficulty: "",
    search: "",
  },
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setCurrentQuestion(state, action) {
      state.currentQuestion = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Single Question
      .addCase(getQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion = action.payload;
      })
      .addCase(getQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Question
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Actions
export const { setCurrentQuestion, setFilters, clearFilters, clearError } = questionSlice.actions;

// Selectors
export const selectAllQuestions = (state) => state.questions.questions;
export const selectQuestionLoading = (state) => state.questions.loading;
export const selectQuestionError = (state) => state.questions.error;
export const selectCurrentQuestion = (state) => state.questions.currentQuestion;
export const selectQuestionFilters = (state) => state.questions.filters;

export default questionSlice.reducer; 