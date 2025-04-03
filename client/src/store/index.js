import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import questionReducer from "./features/questions/questionSlice";
import quizReducer from "./features/quiz/quizSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        questions: questionReducer,
        quiz: quizReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;