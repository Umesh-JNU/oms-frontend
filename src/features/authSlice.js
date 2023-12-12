import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("userToken");
const user = JSON.parse(localStorage.getItem("user"));

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

      console.log({ user, token });
      state.isFetching = false;
      state.user = { _id: action.payload.user._id, username: action.payload.user.firstname + ' ' + action.payload.user.lastname };
      state.token = action.payload.token;

      localStorage.setItem("userToken", state.token);
      localStorage.setItem("user", JSON.stringify({ _id: action.payload.user._id, username: action.payload.user.firstname + ' ' + action.payload.user.lastname }));
    },
    loginFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
    },

    forgotPwdStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      state.message = "";
    },
    forgotPwdSuccess: (state, action) => {
      state.error = false;
      state.errMsg = "";

      state.isFetching = false;
      state.error = false;
      state.message = action.payload.message;
    },
    forgotPwdFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
      state.message = "";
    },

    resetPwdStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      state.message = "";
    },
    resetPwdSuccess: (state, action) => {
      state.error = false;
      state.errMsg = "";

      state.isFetching = false;
      state.error = false;
      state.message = action.payload.message;
    },
    resetPwdFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
      state.message = "";
    },

    registerStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    registerSuccess: (state, action) => {
      state.error = false;
      state.errMsg = "";

      state.isFetching = false;
      state.user = { _id: action.payload.user._id, username: action.payload.user.firstname + ' ' + action.payload.user.lastname };
      state.token = action.payload.token;

      localStorage.setItem("userToken", state.token);
      localStorage.setItem("user", JSON.stringify({ _id: action.payload.user._id, username: action.payload.user.firstname + ' ' + action.payload.user.lastname }));

    },
    registerFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errMsg = action.payload;
    },

    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("userToken");
    },
  },
});

export const {
  logOut,
  loginStart,
  loginSuccess,
  loginFailure,
  forgotPwdStart,
  forgotPwdSuccess,
  forgotPwdFailure,
  resetPwdStart,
  resetPwdSuccess,
  resetPwdFailure,
  registerSuccess,
  registerStart,
  registerFailure,
} = authSlice.actions;
export default authSlice.reducer;
