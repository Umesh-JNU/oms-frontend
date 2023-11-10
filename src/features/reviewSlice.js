import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],
  loadingReview: false,
  reviewsErr: "",
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    reviewStart: (state, action) => {
      state.loadingReview = true;
    },
    reviewSuccess: (state, action) => {
      state.reviewsErr = "";
      state.loadingReview = false;
      state.reviews = action.payload;
    },
    reviewFailure: (state, action) => {
      state.loadingReview = false;
      state.reviewsErr = action.payload;
    },
    setReviews: (state, action) => {
      state.reviews = [];
      state.loadingReview = false;
      state.reviewsErr = "";
    },
  },
});

export const { reviewSuccess, reviewFailure, reviewStart, setReviews } =
  reviewSlice.actions;
export default reviewSlice.reducer;
