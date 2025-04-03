import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userid : undefined,
    username : undefined,
    email : undefined
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        loginUser(state, action){
            state.userid = action.payload.userid;
            state.username = action.payload.username;
            state.email = action.payload.email;
        },
        signoutUser(state){
            state.userid = initialState.userid;
            state.username = initialState.username;
            state.email = initialState.email;
        }
    }
});

export const { loginUser, signoutUser} = userSlice.actions;
export default userSlice.reducer;


