import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    role: null,
    isLoggedIn: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.isLoggedIn = true;
        },

        logout: (state) => {
            state.token = null;
            state.role = null;
            state.isLoggedIn = false;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;