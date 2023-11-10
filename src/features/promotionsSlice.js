import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  promotions: [],
  loadingPromotion: false,
  promotionsErr: "",
};

const promotionsSlice = createSlice({
  name: "promotions",
  initialState,
  reducers: {
    promotionStart: (state, action) => {
      state.loadingPromotion = true;
    },
    promotionSuccess: (state, action) => {
      state.promotionsErr = "";
      state.loadingPromotion = false;
      state.promotions = action.payload;
    },
    promotionFailure: (state, action) => {
      state.loadingPromotion = false;
      state.promotionsErr = action.payload;
    },
  },
});

export const { promotionSuccess, promotionFailure, promotionStart } =
  promotionsSlice.actions;
export default promotionsSlice.reducer;
