import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("userToken");
const user = localStorage.getItem("userId");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user,
    token: token,
    isFetching: false,
    error: false,
    errMsg: "",
  },
  reducers: {
    loginStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.error = false;
      state.errMsg = "";

      state.isFetching = false;
      state.error = false;
      state.user = action.payload.user._id;
      state.token = action.payload.token;

      localStorage.setItem("userToken", state.token);
      localStorage.setItem("userId", state.user);
    },
    loginFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
    },

    registerStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    registerSuccess: (state, action) => {
      state.error = false;
      state.isFetching = false;
      state.error = false;
      state.user = action.payload.user._id;
      state.token = action.payload.token;
      state.errMsg = "";

      localStorage.setItem("userToken", state.token);
      localStorage.setItem("userId", state.user);
    },
    registerFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errMsg = action.payload;
    },

    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("userId");
      localStorage.removeItem("userToken");
    },
  },
});

export const {
  logOut,
  loginStart,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerStart,
  registerFailure,
} = authSlice.actions;
export default authSlice.reducer;