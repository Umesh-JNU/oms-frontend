import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  banners: [],
  loadingBanner: false,
  bannerErr: "",
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    bannerStart: (state, action) => {
      state.loadingBanner = true;
    },
    bannerSuccess: (state, action) => {
      state.bannerErr = "";
      state.loadingBanner = false;
      state.banners = action.payload;
    },
    bannerFailure: (state, action) => {
      state.loadingBanner = false;
      state.bannerErr = action.payload;
    },
  },
});

export const { bannerSuccess, bannerFailure, bannerStart } = bannerSlice.actions;
export default bannerSlice.reducer;
