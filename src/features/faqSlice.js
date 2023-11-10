import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  faq: [],
  loading: false,
  error: "",
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    faqStart: (state, action) => {
      state.loading = true;
      state.error = "";
    },
    faqSuccess: (state, action) => {
      state.error = "";
      state.loading = false;
      state.faq = action.payload;
    },
    faqFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { faqFailure, faqStart, faqSuccess } = faqSlice.actions;
export default faqSlice.reducer;
