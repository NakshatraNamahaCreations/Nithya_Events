import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
    userDetails: {},
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.userDetails = action.payload;
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("userDetails", JSON.stringify(state.userDetails));
    },
    logout(state) {
      state.isAuthenticated = false;
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("userDetails");
      state.userDetails = {};
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
