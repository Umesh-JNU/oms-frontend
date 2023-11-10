import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coupons: [],
  loadingCoupons: false,
  couponsErr: "",
};

const couponCodeSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    couponsStart: (state, action) => {
      state.loadingCoupons = true;
      state.couponsErr = "";
    },
    couponsSuccess: (state, action) => {
      state.loadingCoupons = false;
      state.couponsErr = "";
      state.coupons = action.payload.coupons;
    },
    couponsFailure: (state, action) => {
      state.loadingCoupons = false;
      state.couponsErr = action.payload;
    },
    setCoupons: (state, action) => {
      state.coupons = [];
      state.loadingCoupons = false;
      state.couponsErr = "";
    },
  },
});

export const { couponsStart, couponsFailure, couponsSuccess, setOrder } =
  couponCodeSlice.actions;
export default couponCodeSlice.reducer;
